# Use exact version used by Codeship and AWS
FROM python:3.7-slim-buster

ENV C_FORCE_ROOT 1
ENV DOCKER True
ENV DJANGO_SETTINGS_MODULE config.settings.docker

# create unprivileged user
RUN adduser --disabled-password --gecos '' myuser

# Install PostgreSQL dependencies
# We have to install GCC as the slim and alpine base images do not come with gcc built in
RUN apt-get update && \
    apt-get install -y postgresql-client libpq-dev supervisor netcat gcc

# Step 1: Install any Python packages
# ----------------------------------------

ENV PYTHONUNBUFFERED 1
RUN mkdir -p /var/app/logs
WORKDIR  /var/app

COPY server/requirements ./requirements
ADD server/requirements.txt ./requirements.txt
RUN pip install -U pip && \
    pip install -r requirements/docker.txt && \
    pip install gunicorn

# Step 2: Copy Django Code
# ----------------------------------------

# Copy stuff in rarest-to-most-often order
# Files that should basically never change
COPY server/locale ./locale
COPY server/manage.py \
     server/runserver.sh \
     server/runbeat.sh \
     server/runworker.sh \
     server/runtest.sh \
     server/server-init.sh \
     server/supervisord_worker.conf \
     server/supervisord_beat.conf \
     ./
# Files that will change rarely
COPY server/templates ./templates
COPY server/config ./config
# Files that will change often
COPY server/apps ./apps