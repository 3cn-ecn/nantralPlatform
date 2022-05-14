#!/bin/bash

# Description:
# -------
# Force the renewal of all the letsencrypt certificates.
# Use this script manually, ONLY if the certificates did not renew by themselves.
# If that's the case, you should probably debug the issue first.

# Notes:
# ------
# This script uses a custom webroot-path for certbot, as it relies on the existing
# Nginx Docker container to serve the files for the challenge. If you modify the
# configuration of the Nginx container, make sure this script will still run by using
# the dry run parameter for certbot.
# 
# The copy step allows to serve the certificates both for the mail server and Nginx.

# Author: Charles Zablit
# Date: April 2022

cd /home/ubuntu/nantralPlatform/deployment

# Renew certificates
certbot certonly --force-renew --webroot --webroot-path ./certbot/www/ -d nantral-platform.fr -d wiki.nantral-platform.fr -d webmail.nantral-platform.fr -d dev.nantral-platform.fr -d www.nantral-platform.fr -d mail.nantral-platform.fr

# Move certificates to handle mails
cp /etc/letsencrypt/live/nantral-platform.fr/privkey.pem /home/ubuntu/nantralPlatform/deployment/certs/key.pem || exit 1
cp /etc/letsencrypt/live/nantral-platform.fr/fullchain.pem /home/ubuntu/nantralPlatform/deployment/certs/cert.pem || exit 1

# Reload nginx
docker-compose exec nginx nginx -s reload