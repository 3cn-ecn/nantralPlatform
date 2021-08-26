#!/bin/bash

while ! nc -zw1 $DB_HOSTNAME $DB_PORT; do
echo "Database not found on network."
sleep 1
done

# Start the memory cache
memcached -u root -d

cd /var/app

echo "========= Migrate database"
python manage.py migrate --no-input
echo "========= DONE ============"

echo "========= Collect static files"
python manage.py collectstatic --no-input
echo "========= DONE ============"

echo "========= Starting server ========="
/usr/local/bin/gunicorn --log-level info --log-file=- --name nantral_platform -b 0.0.0.0:8000 --reload config.wsgi:application