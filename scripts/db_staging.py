import docker
import gzip
import os
from environs import Env
import boto3
from datetime import date
import logging

logging.basicConfig(filename='db_staging.log',
                    filemode='a+',
                    format='%(asctime)s %(message)s',
                    datefmt='%m/%d/%Y %I:%M:%S %p',
                    level=logging.DEBUG)


def docker_db_clone(filename: str, db_user: str, db_name: str, db_name_staging: str, container_name: str):

    client = docker.from_env()
    db_container = client.containers.get(container_name)
    _, output = db_container.exec_run(
        f"pg_dump {db_name} > {filename} -U {db_user} && psql -U {db_user} {db_name_staging} < {filename}")
    client.close()


try:
    env = Env()
    env.read_env("../deployment/.env")
    DB_USER = env.str("POSTGRES_USER")
    DB_NAME = env.str("DB_NAME_STAGING")
    DB_NAME_PROD = env.str("DB_NAME")
    DB_CONTAINER = env.str("DB_CONTAINER")
    BUCKET = env.str("S3_BUCKET")
    AWS_ACCESS_KEY_ID = env.str("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = env.str("AWS_SECRET_ACCESS_KEY")
    AWS_REGION = env.str("AWS_SES_REGION")
    ERROR_RECIPIENT = env.str("ERROR_RECIPIENT")
    try:
        docker_db_clone("dump_staging.sql", DB_USER,
                        DB_NAME_PROD, DB_NAME, DB_CONTAINER)
    except Exception as err:
        text = f"Got an error while cloning the DB : {err}"

except Exception as err:
    logging.error(err)
