#!/bin/bash

while ! nc -zw1 "$POSTGRES_HOSTNAME" "$POSTGRES_PORT"; do
echo "[$HOSTNAME] Database not found on network."
sleep 1
done

cd /var/app || exit

echo "========= [$HOSTNAME] Migrate database"
python manage.py migrate --no-input
echo "========= [$HOSTNAME] DONE ============"

echo "========= [$HOSTNAME] Starting server ========="
gunicorn --log-level info --log-file=- --name "$HOSTNAME" -b 0.0.0.0:8000 --workers "${GUNICORN_WORKERS:-4}" config.wsgi:application
