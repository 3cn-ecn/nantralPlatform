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
    print("====|Getting .env variables...|====")
    env = Env()
    env.read_env("../../nantralPlatform/deployment/.env")
    DB_USER = env.str("POSTGRES_USER")
    DB_PASSWORD = env.str("POSTGRES_PASSWORD")
    DB_NAME_STAGING = env.str("POSTGRES_DB_STAGING")
    DB_HOST = env.str("DB_HOSTNAME")
    DB_PORT = env.str("DB_PORT")
    DB_NAME_PROD = env.str("POSTGRES_DB")
    DB_CONTAINER = env.str("DB_CONTAINER")
    BUCKET = env.str("S3_BUCKET")
    AWS_ACCESS_KEY_ID = env.str("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = env.str("AWS_SECRET_ACCESS_KEY")
    AWS_REGION = env.str("AWS_SES_REGION")
    ERROR_RECIPIENT = env.str("ERROR_RECIPIENT")
    print("====|Done|====")

    print("====|Getting DB container's IP...|====")
    client = docker.from_env()
    db_container = client.containers.get(DB_CONTAINER)
    IP = db_container.attrs["NetworkSettings"]["Networks"]["deployment_default"]["IPAddress"]
    print("====|Done|====")

    print("====|Connecting to the DB...|====")
    ps_connection = psycopg2.connect(user=DB_USER,
                                     password=DB_PASSWORD,
                                     host=IP,
                                     port=DB_PORT)
    ps_connection.autocommit = True
    cursor = ps_connection.cursor()
    print("====|Done|====")

    print("====|Dropping the old staging DB if it exists...|====")
    cursor.execute(
        f"DROP DATABASE IF EXISTS {DB_NAME_STAGING} WITH ( FORCE );")
    print("====|Done|====")

    print("====|Recreating the staging DB...|====")
    cursor.execute(f"CREATE DATABASE {DB_NAME_STAGING} OWNER {DB_USER};")
    print("====|Done|====")

    print("====|Dumping the contents of the production DB...|====")
    _, output = db_container.exec_run(
        f"/bin/bash -c 'pg_dump -U {DB_USER} {DB_NAME_PROD} > dump.sql'")
    print("====|Done|====")

    print("====|Importing the contents of the production DB...|====")
    _, output = db_container.exec_run(
        f"/bin/bash -c 'psql -U {DB_USER} {DB_NAME_STAGING} < dump.sql'")
    print("====|Done|====")

except (Exception, psycopg2.DatabaseError) as error:
    print("Error while connecting to PostgreSQL", error)

finally:
    if ps_connection:
        cursor.close()
        ps_connection.close()

    if client:
        client.close()
        print("====|Connections have been closed. Goodbye.|====")
