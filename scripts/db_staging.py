import psycopg2
from environs import Env
import logging

logging.basicConfig(filename='db_staging.log',
                    filemode='a+',
                    format='%(asctime)s %(message)s',
                    datefmt='%m/%d/%Y %I:%M:%S %p',
                    level=logging.DEBUG)

try:
    env = Env()
    env.read_env("../deployment/.env")
    DB_USER = env.str("POSTGRES_USER")
    DB_PASSWORD = env.str("POSTGRES_PASSWORD")
    DB_NAME_STAGING = env.str("DB_NAME_STAGING")
    DB_NAME_PROD = env.str("DB_NAME")
    DB_CONTAINER = env.str("DB_CONTAINER")
    BUCKET = env.str("S3_BUCKET")
    AWS_ACCESS_KEY_ID = env.str("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = env.str("AWS_SECRET_ACCESS_KEY")
    AWS_REGION = env.str("AWS_SES_REGION")
    ERROR_RECIPIENT = env.str("ERROR_RECIPIENT")

    ps_connection = psycopg2.connect(user=DB_USER,
                                     password=DB_PASSWORD,
                                     host="127.0.0.1",
                                     port="5432")

    cursor = ps_connection.cursor()

    cursor.execute(f"DROP DATABASE IF EXISTS {DB_NAME_STAGING};")
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
