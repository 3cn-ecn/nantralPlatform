#!/usr/bin/env python

"""Make a copy of the production database onto the staging server.

If an error occurs, send it to a Discord channel.

Author: Alexis Delage - Mai 2022
"""

from typing import Callable, Union
from discord_webhook import DiscordWebhook, DiscordEmbed
import docker
import environ
import os
import logging
import psycopg2

DIR_PATH = os.path.dirname(os.path.realpath(__file__))

logging.basicConfig(filename='db_staging.log',
                    filemode='a+',
                    format='[DB STAGING] %(asctime)s %(message)s',
                    datefmt='%m/%d/%Y %I:%M:%S %p',
                    level=logging.DEBUG)


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


def copy_database(
    db_user: str,
    db_password: str,
    db_port: str,
    db_name_source: str,
    db_name_target: str,
    db_container_name: str
) -> Union[Exception, None]:
    """Connect to the DB, drop the target DB if it exists, recreate it, dump the
    contents of the source DB, and import them to the target DB.

    Parameters
    ----------
    db_user : str
        The user that has access to the DB.
    db_password : str
        The password of the user that will be used to connect to the DB.
    db_port : str
        The port that the DB is running on.
    db_name_source : str
        The name of the database you want to copy from.
    db_name_target : str
        The name of the database you want to copy to.
    db_container_name : str
        The name of the container that runs the database.

    Returns
    -------
        output: Exception | None
    """

    try:
        log(logging.debug, "Getting DB container's IP...")
        client = docker.from_env()
        db_container = client.containers.get(db_container_name)
        IP = db_container.attrs["NetworkSettings"]["Networks"][
            "deployment_default"]["IPAddress"]
        log(logging.debug, "Done.")

        log(logging.debug, "Connecting to the DB...")
        ps_connection = psycopg2.connect(
            user=db_user, password=db_password, host=IP, port=db_port)
        ps_connection.autocommit = True
        cursor = ps_connection.cursor()
        log(logging.debug, "Done.")

        log(logging.debug, "Dropping the old target DB if it exists...")
        cursor.execute(
            f"DROP DATABASE IF EXISTS {db_name_target} WITH ( FORCE );")
        log(logging.debug, "Done.")

        log(logging.debug, "Recreating the target DB...")
        cursor.execute(f"CREATE DATABASE {db_name_target} OWNER {db_user};")
        log(logging.debug, "Done.")

        log(logging.debug, "Dumping the contents of the source DB...")
        db_container.exec_run(
            f"/bin/bash -c 'pg_dump -U {db_user} {db_name_source} > dump.sql'")
        log(logging.debug, "Done.")

        log(logging.debug, "Importing the contents to the target DB...")
        db_container.exec_run(
            f"/bin/bash -c 'psql -U {db_user} {db_name_target} < dump.sql'")
        log(logging.debug, "Done.")

        log(logging.info, "Success.")
        output = None

    except (Exception, psycopg2.DatabaseError) as err:
        log(logging.error, err)
        output = err

    finally:
        if ps_connection:
            cursor.close()
            ps_connection.close()
        if client:
            client.close()
        log(logging.debug, "Connections have been closed. Goodbye.")

    return output


def send_status(url: str, err: Exception = None):
    """Send a status update to Discord.

    Parameters
    ----------
    url : str
        The url of the webhook.
    err: str
        The error which appends during the process
    """

    webhook = DiscordWebhook(url=url)
    embed = DiscordEmbed(title="**Database Copy From Production To Staging**")
    embed.description = ""
    if err is not None:
        embed.add_embed_field(name="Status", value="Error 🔴", inline=True)
        embed.add_embed_field(name="Message", value=err.__str__(), inline=True)
        embed.set_timestamp()
        log(logging.info, "Sending error notification.")
    webhook.add_embed(embed)
    webhook.execute()


if __name__ == "__main__":
    log(logging.info, "Starting database copy for staging.")

    log(logging.debug, "Getting environment variables.")
    env = environ.Env()
    env.read_env("../../nantralPlatform/deployment/backend.env")
    DB_USER = env.str("POSTGRES_USER")
    DB_PASSWORD = env.str("POSTGRES_PASSWORD")
    DB_NAME_PROD = env.str("POSTGRES_DB")
    DB_NAME_STAGING = env.str("POSTGRES_DB_STAGING")
    DB_HOST = env.str("DB_HOSTNAME")
    DB_PORT = env.str("DB_PORT")
    DB_CONTAINER = env.str("DB_CONTAINER")
    DISCORD_WEBHOOK = env.str("DISCORD_BACKUP_STATUS_WEBHOOK")
    log(logging.debug, "Done getting environment variables.")

    output = copy_database(
        db_user=DB_USER,
        db_password=DB_PASSWORD,
        db_port=DB_PORT,
        db_name_source=DB_NAME_PROD,
        db_name_target=DB_NAME_STAGING,
        db_container_name=DB_CONTAINER
    )
    if output is not None:
        send_status(DISCORD_WEBHOOK, output)
