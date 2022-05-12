#!/usr/bin/env python

"""Make a dump of the database and upload it to the S3.

Send the status of the backup to a Discord channel.

Author: Charles Zablit - Mai 2022
"""

from typing import Callable
import docker
import gzip
import os
from environs import Env
import boto3
from botocore.config import Config
from datetime import datetime
import logging
from discord_webhook import DiscordWebhook, DiscordEmbed

DIR_PATH = os.path.dirname(os.path.realpath(__file__))

logging.basicConfig(filename='db_backup.log',
                    filemode='a+',
                    format='[DB BACKUP] %(asctime)s %(message)s',
                    datefmt='%m/%d/%Y %I:%M:%S %p',
                    level=logging.ERROR)


def log(fn: Callable, msg: str) -> None:
    """Log and print a message.

    Args:
        fn (Callable): The logging function to call.
        msg (str): The message to log.

    """
    print(msg)
    fn(msg)


def docker_db_dump(filename: str, db_user: str, db_name: str, container_name: str) -> None:
    """Generate a dump of a database given its credentials.

    Args:
        filename (str): The name of the dump.
        db_user (str): The database's user.
        db_name (str): The database's name.
        container_name (str): The Docker container's name.

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


def upload_file(file_name: str, bucket: str, object_name: str, access_key_id: str, access_secret_key: str) -> None:
    """Upload a file to an S3 bucket.

    Args:
        file_name (str): The name of the file to upload.
        bucket (str): The name of the bucket to upload to.
        object_name (str): The name of the S3 object to create.
        access_key_id (str): The access key id of the user.
        access_secret_key (str): The access key secret of the user.

    """
    log(logging.debug, "Uploading to S3.")
    s3_client = boto3.client('s3', endpoint_url="https://s3.gra.cloud.ovh.net/",
                             aws_access_key_id=access_key_id,
                             aws_secret_access_key=access_secret_key,
                             config=Config(s3={"addressing_style": "virtual"}))
    s3_client.upload_file(file_name, bucket, object_name)
    log(logging.debug, "Done uploading to S3.")


def send_status(url: str, file_name: str = None):
    """Send a status update to Discord.

    Args:
        url (str): The url of the webhook.
        file_name (str, optional): The name of the uploaded file, if it exists. Defaults to None.

    """
    webhook = DiscordWebhook(url=url)
    embed = DiscordEmbed(title="**Database Backup Status**")
    embed.description = ""
    if file_name is not None:
        embed.add_embed_field(name="Status", value="Success 🟢", inline=True)
        embed.add_embed_field(name="File Name", value=f"`{file_name}`", inline=True)
        log(logging.info, "Sending success notification.")
    else:
        embed.add_embed_field(name="Status", value="Error 🔴", inline=True)
        embed.add_embed_field(name="File Name", value="None", inline=True)
        log(logging.info, "Sending error notification.")
    webhook.add_embed(embed)
    webhook.execute()


def main() -> None:
    """Backup and upload database dump."""
    docker_db_dump("output.sql.gz", DB_USER, DB_NAME, DB_CONTAINER)
    object_name = datetime.now().strftime("%Y/%B/%d-%H:%M:%S")
    object_extension = ".sql.gz"
    upload_file("output.sql.gz", bucket=BUCKET,
                object_name=f"backups/{object_name}{object_extension}",
                access_key_id=AWS_ACCESS_KEY_ID, access_secret_key=AWS_SECRET_ACCESS_KEY)
    os.remove("output.sql.gz")
    send_status(DISCORD_WEBHOOK, object_name+object_extension)


if __name__ == "__main__":
    log(logging.info, "Starting database backup.")

    log(logging.debug, "Getting environment variables.")
    env = Env()
    env.read_env("../deployment/backend.env")
    DB_USER = env.str("POSTGRES_USER")
    DB_NAME = env.str("DB_NAME")
    DB_CONTAINER = env.str("DB_CONTAINER")
    BUCKET = env.str("S3_BUCKET")
    AWS_ACCESS_KEY_ID = env.str("OVH_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = env.str("OVH_SECRET_ACCESS_KEY")
    DISCORD_WEBHOOK = env.str("DISCORD_BACKUP_STATUS_WEBHOOK")
    log(logging.debug, "Done getting environment variables.")
    try:
        main()
        log(logging.info, "Success.")
    except Exception as err:
        log(logging.error, err)
        send_status(DISCORD_WEBHOOK)
