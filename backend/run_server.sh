#!/bin/bash

while ! nc -zw1 $DB_HOSTNAME $DB_PORT; do
echo "[$HOSTNAME] Database not found on network."
sleep 1
done

cd /var/app || exit

echo "========= [$HOSTNAME] Migrate database"
uv run manage.py migrate --no-input
echo "========= [$HOSTNAME] DONE ============"

echo "========= [$HOSTNAME] Starting server ========="
uv run gunicorn --log-level info --log-file=- --name "$HOSTNAME" -b 0.0.0.0:8000 --workers "${GUNICORN_WORKERS:-4}" config.wsgi:application
