#!/usr/bin/env python

"""
Manage the backups of the production database.

Without passing any argument, the script will make a backup
of the production database and upload it to a private S3
bucket. It will send the status of the backup to a Discord
channel using webhooks.

If the `--cleanup` argument is passed, the script will delete
all the backups that are older than 30 days, while making sure
to keep at least 1. It will send the status of the cleanup
to the same Discord channel.

Author: Charles Zablit - May 2022
"""

from typing import Callable, Dict
from argparse import ArgumentParser
from datetime import datetime
import pytz
from botocore.config import Config
from discord_webhook import DiscordWebhook, DiscordEmbed
import docker
import environ
import gzip
import os
import boto3
import logging

DIR_PATH = os.path.dirname(os.path.realpath(__file__))

logging.basicConfig(filename='db_backup.log',
                    filemode='a+',
                    format='[DB BACKUP] %(asctime)s %(message)s',
                    datefmt='%m/%d/%Y %I:%M:%S %p',
                    level=logging.ERROR)


def log(fn: Callable, msg: str) -> None:
    """Log and print a message.

    Parameters
    ----------
    fn : Callable
        The logging function to call.
    msg : str
        The message to log.
    """

    print(msg)
    fn(msg)


def docker_db_dump(
    filename: str,
    db_user: str,
    db_name: str,
    container_name: str
) -> None:
    """Generate a dump of a database given its credentials.

    Parameters
    ----------
    filename : str
        The name of the dump.
    db_user : str
        The database's user.
    db_name : str
        The database's name.
    container_name : str
        The Docker container's name.
    """

    log(logging.debug, "Dumping db.")
    client = docker.from_env()
    db_container = client.containers.get(container_name)
    _, output = db_container.exec_run(
        f"/bin/bash -c 'pg_dump {db_name} -U {db_user}'")
    with gzip.open(f"{filename}", "wb") as file:
        file.write(output)
    client.close()
    log(logging.debug, "Done dumping db.")


def upload_file(
    file_name: str,
    bucket: str,
    object_name: str,
    access_key_id: str,
    access_secret_key: str
) -> None:
    """Upload a file to an S3 bucket.

    Parameters
    ----------
    file_name : str
        The name of the file to upload.
    bucket : str
        The name of the bucket to upload to.
    object_name : str
        The name of the S3 object to create.
    access_key_id : str
        The access key id of the user.
    access_secret_key : str
        The access key secret of the user.
    """

    log(logging.debug, "Uploading to S3.")
    s3_client = boto3.client('s3', endpoint_url="https://s3.gra.cloud.ovh.net/",
                             aws_access_key_id=access_key_id,
                             aws_secret_access_key=access_secret_key,
                             config=Config(s3={"addressing_style": "virtual"}))
    s3_client.upload_file(file_name, bucket, object_name)
    log(logging.debug, "Done uploading to S3.")


def send_upload_status(url: str, file_path: str = None, size: int = None):
    """Send a backup status update to Discord.

    Parameters
    ----------
    url : str
        The url of the webhook.
    file_path : str, optional
        The name of the uploaded file, if it exists, by default None
    size : int, optional
        The size of the uploaded file, if it exists, by default None
    """

    webhook = DiscordWebhook(url=url)
    embed = DiscordEmbed(title="💾 **Database Backup Status** 💾")
    embed.description = ""
    if file_path is not None:
        embed.add_embed_field(name="Status", value="Success 🟢", inline=True)
        embed.add_embed_field(
            name="File Name", value=f"`{file_path}`", inline=True)
        size = round(size / (10**6), 3)
        embed.set_footer(text=f"File size: {size} Mo")
        embed.set_timestamp()
        log(logging.info, "Sending success notification.")
    else:
        embed.add_embed_field(name="Status", value="Error 🔴", inline=True)
        embed.add_embed_field(name="File Name", value="None", inline=True)
        embed.set_timestamp()
        log(logging.info, "Sending error notification.")
    webhook.add_embed(embed)
    webhook.execute()


def send_cleanup_status(url: str, counter: int):
    """Send a cleanup status update to Discord.

    Parameters
    ----------
    url : str
        The url of the webhook.
    counter : int
        The number of deleted files.
    """

    webhook = DiscordWebhook(url=url)
    embed = DiscordEmbed(title="🗑️ **S3 Cleanup Status** 🗑️")
    embed.description = ""
    if counter != -1:
        embed.add_embed_field(name="Status", value=f"{counter} files deleted. 🟢", inline=True)
        embed.set_timestamp()
        log(logging.info, "Sending success notification.")
    else:
        embed.add_embed_field(name="Status", value="No files were deleted. 🔴", inline=True)
        embed.set_timestamp()
        log(logging.info, "Sending error notification.")
    webhook.add_embed(embed)
    webhook.execute()


def backup() -> None:
    """Backup and upload database dump."""
    docker_db_dump("output.sql.gz", DB_USER, DB_NAME, DB_CONTAINER)
    object_name = datetime.now().strftime("%Y/%B/%d-%H:%M:%S")
    object_extension = ".sql.gz"
    upload_file("output.sql.gz", bucket=BUCKET,
                object_name=f"backups/{object_name}{object_extension}",
                access_key_id=AWS_ACCESS_KEY_ID,
                access_secret_key=AWS_SECRET_ACCESS_KEY)
    size = os.path.getsize("output.sql.gz")
    os.remove("output.sql.gz")
    send_upload_status(DISCORD_WEBHOOK, object_name + object_extension, size)


def delete_old_backups(
    bucket: str,
    access_key_id: str,
    access_secret_key: str
) -> None:
    """Upload a file to an S3 bucket.

    Parameters
    ----------
    bucket : str
        The name of the bucket to upload to.
    access_key_id : str
        The access key id of the user.
    access_secret_key : str
        The access key secret of the user.
    """

    log(logging.debug, "Listing files to delete.")
    counter = 0
    s3_client = boto3.client('s3', endpoint_url="https://s3.gra.cloud.ovh.net/",
                             aws_access_key_id=access_key_id,
                             aws_secret_access_key=access_secret_key,
                             config=Config(s3={"addressing_style": "virtual"}))
    response: Dict = s3_client.list_objects_v2(Bucket=bucket, Prefix="backups/")
    # Keep track of the number of files to make sure we don't delete all the backups.
    nb_backups = len(response.get("Contents"))
    obj: Dict
    for obj in response.get("Contents"):
        key: str = obj.get("Key")
        last_modified: datetime = obj.get("LastModified")
        time_diff = datetime.now(pytz.timezone("Europe/Paris")) - last_modified
        if time_diff.days > 30 and key.endswith(".sql.gz") and nb_backups - 1 > counter:
            s3_client.delete_object(Bucket=bucket, Key=key)
            counter += 1
    send_cleanup_status(DISCORD_WEBHOOK, counter)
    log(logging.info, f"{counter} files have been deleted")


if __name__ == "__main__":
    parser = ArgumentParser()
    parser.add_argument(
        "--cleanup", help="Enable cleanup mode", action="store_true")
    args = parser.parse_args()

    log(logging.info, "Starting database backup.")

    log(logging.debug, "Getting environment variables.")
    env = environ.Env()
    env.read_env("../backend.env")
    DB_USER = env.str("POSTGRES_USER")
    DB_NAME = env.str("POSTGRES_DB")
    DB_CONTAINER = env.str("DB_CONTAINER")
    BUCKET = env.str("S3_BUCKET_PRIVATE")
    AWS_ACCESS_KEY_ID = env.str("OVH_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = env.str("OVH_SECRET_ACCESS_KEY")
    DISCORD_WEBHOOK = env.str("DISCORD_BACKUP_STATUS_WEBHOOK")
    log(logging.debug, "Done getting environment variables.")

    if args.cleanup:
        try:
            delete_old_backups(BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
            log(logging.info, "Success.")
        except Exception as err:
            log(logging.exception, err)
            send_cleanup_status(DISCORD_WEBHOOK, -1)
        finally:
            exit()
    try:
        backup()
        log(logging.info, "Success.")
    except Exception as err:
        log(logging.error, err)
        send_upload_status(DISCORD_WEBHOOK)
