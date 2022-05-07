FROM python:3.10-slim-buster

ENV C_FORCE_ROOT 1
ENV DOCKER True
ENV DJANGO_SETTINGS_MODULE=config.settings.production

# create unprivileged user
RUN adduser --disabled-password --gecos '' myuser

# Install PostgreSQL dependencies
# We have to install GCC as the slim and alpine base images do not come with gcc built in
RUN apt-get update && \
  apt-get install -y postgresql-client libpq-dev supervisor netcat gcc memcached git

# Step 1: Install any Python packages
# ----------------------------------------

ENV PYTHONUNBUFFERED 1
RUN mkdir -p /var/app/logs
RUN mkdir var/app/staticfiles
WORKDIR  /var/app

ADD backend/requirements.txt ./requirements.txt
RUN pip install -U pip && \
  pip install -r requirements.txt

# Step 2: Copy Django Code
# ----------------------------------------

# Copy stuff in rarest-to-most-often order
# Files that should basically never change
COPY backend/manage.py \
  backend/run_server.sh
# Files that will change rarely
COPY backend/templates ./templates
COPY backend/config ./config
# Files that will change often
COPY backend/apps ./apps
