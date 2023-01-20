#!/bin/bash

# Description:
# -------
# Run a python script that deletes all database backups that are older than 30 days,
# while making sure to keep at least 1.
# This script is meant to be run every month using a cronjob.
# 
# Author: Charles Zablit
# Date: August 2022

cd ~/nantralPlatform/deployment/scripts
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python3 db_backup.py --cleanup
deactivate
rm -r env