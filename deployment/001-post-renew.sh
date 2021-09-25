#!/bin/sh
cp /etc/letsencrypt/live/nantral-platform.fr/privkey.pem /home/ubuntu/nantralPlatform/deployment/certs/key.pem || exit 1
cp /etc/letsencrypt/live/nantral-platform.fr/fullchain.pem /home/ubuntu/nantralPlatform/deployment/certs/cert.pem || exit 1
docker exec deployment_front_1 nginx -s reload