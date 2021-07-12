import docker
import gzip
import os
from environs import Env
import boto3
from datetime import date
import logging

logging.basicConfig(filename='db_backup.log',
                    filemode='a+',
                    format='%(asctime)s %(message)s',
                    datefmt='%m/%d/%Y %I:%M:%S %p',
                    level=logging.DEBUG)


def docker_db_dump(filename: str, db_user: str, db_name: str, container_name: str):

    client = docker.from_env()
    db_container = client.containers.get(container_name)
    _, output = db_container.exec_run(
        f"pg_dump {db_name} -U {db_user}")
    with gzip.open(f"{filename}", "wb") as file:
        file.write(output)
    client.close()


def upload_file(file_name: str, bucket: str, object_name: str, access_key_id: str, access_secret_key: str):
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """
    s3_client = boto3.client('s3', aws_access_key_id=access_key_id,
                             aws_secret_access_key=access_secret_key)
    s3_client.upload_file(file_name, bucket, object_name)


def send_mail(text: str, html: str, subject: str, recipient: str, region: str, access_key_id: str, access_secret_key: str):
    client = boto3.client('ses', region_name=region, aws_access_key_id=access_key_id,
                          aws_secret_access_key=access_secret_key)
    CHARSET = "UTF-8"
    client.send_email(
        Destination={
            'ToAddresses': [
                recipient,
            ],
        },
        Message={
            'Body': {
                'Html': {
                    'Charset': CHARSET,
                    'Data': text,
                },
                'Text': {
                    'Charset': CHARSET,
                    'Data': html,
                },
            },
            'Subject': {
                'Charset': CHARSET,
                'Data': subject,
            },
        },
        Source="alerts@nantral-platform.fr"
    )


try:
    env = Env()
    env.read_env("../deployment/.env")
    DB_USER = env.str("POSTGRES_USER")
    DB_NAME = env.str("DB_NAME")
    DB_CONTAINER = env.str("DB_CONTAINER")
    BUCKET = env.str("S3_BUCKET")
    AWS_ACCESS_KEY_ID = env.str("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = env.str("AWS_SECRET_ACCESS_KEY")
    AWS_REGION = env.str("AWS_SES_REGION")
    ERROR_RECIPIENT = env.str("ERROR_RECIPIENT")
    try:
        docker_db_dump("output.sql.gz", DB_USER, DB_NAME, DB_CONTAINER)
        upload_file("output.sql.gz", bucket=BUCKET,
                    object_name=f"backups/{date.today().strftime('%Y/%B/%d')}.sql.gz", access_key_id=AWS_ACCESS_KEY_ID, access_secret_key=AWS_SECRET_ACCESS_KEY)
        os.remove("output.sql.gz")
    except Exception as err:
        text = f"Got an error while doing a backup of the DB : {err}"
        html = f"<h1>Error while db backup</h1><p>Got an error while doing a backup of the DB : </br>{err}</p>"
        send_mail(text, html, "Error while doing db backup", ERROR_RECIPIENT,
                  AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
except Exception as err:
    logging.error(err)
