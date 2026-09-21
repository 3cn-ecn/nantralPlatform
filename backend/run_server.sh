#!/bin/bash

while ! nc -zw1 $DB_HOSTNAME $DB_PORT; do
echo "[$HOSTNAME] Database not found on network."
sleep 1
done

# Start the memory cache
memcached -u root -d

cd /var/app

echo "========= [$HOSTNAME] Migrate database"
uv run manage.py migrate --no-input
echo "========= [$HOSTNAME] DONE ============"

echo "========= [$HOSTNAME] Collect static files"
uv run manage.py collectstatic --no-input
echo "========= [$HOSTNAME] DONE ============"

echo "========= [$HOSTNAME] Compile translations"
uv run manage.py compilemessages -l fr -l en
echo "========= [$HOSTNAME] DONE ============"

echo "========= [$HOSTNAME] Starting server ========="
uv run gunicorn --log-level info --log-file=- --name "$HOSTNAME" -b 0.0.0.0:8000 --reload config.wsgi:application
