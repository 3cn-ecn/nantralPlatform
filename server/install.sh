#!/bin/bash

echo "========= Creating environment"
python3 -m virtualenv env
echo "========= DONE ========="

. env/bin/activate

echo "========= Installing requirements"
pip install -r requirements.txt 2>/dev/null
echo "========= DONE ========="

echo "========= Initializing database"
python manage.py migrate 2>/dev/null
echo "========= DONE ========="
