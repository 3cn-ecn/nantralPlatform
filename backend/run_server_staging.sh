#!/bin/bash

while ! nc -zw1 $DB_HOSTNAME $DB_PORT; do
echo "[STAGING] Database not found on network."
sleep 1
done

# Start the memory cache
memcached -u root -d

cd /var/app

echo "========= [STAGING] Migrate database"
python manage.py migrate --no-input
echo "========= [STAGING] DONE ============"

echo "========= [STAGING] Collect static files"
python manage.py collectstatic --no-input
echo "========= [STAGING] DONE ============"

echo "========= Compile translations"
python manage.py compilemessages -l fr -l en
echo "========= DONE ============"

echo "========= [STAGING] Starting server ========="
/usr/local/bin/gunicorn --log-level info --log-file=- --name nantral_platform_staging -b 0.0.0.0:8001 --reload config.wsgi:application