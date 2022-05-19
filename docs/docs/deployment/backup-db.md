---
title: Backup the database
description: "Instructions on how to backup the production's database"
published: true
date: 2022-05-12T15:54:27.753Z
editor: markdown
dateCreated: 2021-09-27T21:44:30.053Z
---

# Backups

This page is about backups of the database on the server. It requires you to have access to the server and already been connected to the ssh terminal.

## Automatic Backups

- Backups of the database are made every day at 05:00 AM and stored on our S3 bucket.
- They are stored for 30 days. (There is currently nothing to delete them automatically).
- To make a backup manually: `cd /home/ubuntu/nantralPlatform/scripts && source env/bin/activate && python3 db_backup.py && deactivate`.

- A simple restore script is provided. You need to specify some environment variables first:
  ```
    TARGET_DB: the db name to restore
    TARGET_ARCHIVE: the full path of the archive to restore
  ```
  The restore script will delete the TARGET_DB, so make sure you know what you are doing. Then it will create a new one and restore the content from TARGET_ARCHIVE
  If you specify these environment variable using docker-compose.yml file, then you can execute a restore process like this:
  `docker-compose exec dbbackup ./restore.sh`

## Create and download a backup

1. CD into the development directory with `cd nantralPlatform/deployment`.
2. Dump the database with `docker exec deployment_database_1 pg_dump -U userNameDatabase nantral > dump.sql`.
   This creates a dump.sql file containing all the database's data.
3. In order to download the file, run this command in your terminal `scp -i nantral_platform.pem ubuntu@nantral-platform.fr:~/nantralPlatform/deployment/dump.sql ./dump.sql`

## Upload and use a backup

1. Transfer the file to the server by running `scp -i nantral_platform.pem dump.sql ubuntu@nantral-platform.fr:~/nantralPlatform/deployment/dump.sql`.
2. Transfer the file to the container with `sudo docker cp dump.sql deployment_database_1:dump.sql`.
3. Open the container's command line with `sudo docker exec -it deployment_database_1 bin/sh`.
4. Restore from the backup with `psql -U <username> <dbname> < dump.sql`.
   Note that username and dbname are available in the .env file in the deployment directory.
5. Delete the dump.sql file using `rm dump.sql`.
6. Exit the container by running `exit` and delete the dump again with `rm dump.sql`.
