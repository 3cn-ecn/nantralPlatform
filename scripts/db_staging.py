import psycopg2
import docker
from environs import Env
import logging

logging.basicConfig(filename='db_staging.log',
                    filemode='a+',
                    format='%(asctime)s %(message)s',
                    datefmt='%m/%d/%Y %I:%M:%S %p',
                    level=logging.DEBUG)

try:
    env = Env()
    env.read_env("../../nantralPlatform/deployment/.env")
    DB_USER = env.str("POSTGRES_USER")
    DB_PASSWORD = env.str("POSTGRES_PASSWORD")
    DB_NAME_STAGING = env.str("DB_NAME_STAGING")
    DB_HOST = env.str("DB_HOSTNAME")
    DB_PORT = env.str("DB_PORT")
    DB_NAME_PROD = env.str("DB_NAME")
    DB_CONTAINER = env.str("DB_CONTAINER")
    BUCKET = env.str("S3_BUCKET")
    AWS_ACCESS_KEY_ID = env.str("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = env.str("AWS_SECRET_ACCESS_KEY")
    AWS_REGION = env.str("AWS_SES_REGION")
    ERROR_RECIPIENT = env.str("ERROR_RECIPIENT")
    client = docker.from_env()
    db_container = client.containers.get(DB_CONTAINER)
    IP = db_container.attrs["NetworkSettings"]["Networks"]["deployment_default"]["IPAddress"]
    ps_connection = psycopg2.connect(user=DB_USER,
                                     password=DB_PASSWORD,
                                     host=IP,
                                     port=DB_PORT)
    ps_connection.autocommit = True
    cursor = ps_connection.cursor()

    cursor.execute(f"DROP DATABASE {DB_NAME_STAGING} WITH ( FORCE );")
    cursor.execute(
        f"CREATE DATABASE {DB_NAME_STAGING} WITH TEMPLATE {DB_NAME_PROD}")

except (Exception, psycopg2.DatabaseError) as error:
    print("Error while connecting to PostgreSQL", error)

finally:
    # closing database connection.
    if ps_connection:
        cursor.close()
        ps_connection.close()
        print("PostgreSQL connection is closed")
