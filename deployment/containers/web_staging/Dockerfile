FROM python:3.10-slim-buster

ENV PYTHONUNBUFFERED 1
ENV C_FORCE_ROOT 1
ENV DOCKER True
ENV DJANGO_SETTINGS_MODULE=config.settings.production

# create unprivileged user
RUN adduser --disabled-password --gecos '' myuser

# Install PostgreSQL dependencies
# We have to install GCC as the slim and alpine base images do not come with gcc built in
RUN apt-get update && \
  apt-get install -y postgresql-client libpq-dev supervisor netcat gcc memcached git gettext

# Step 1: Install any Python packages
# ----------------------------------------

RUN mkdir -p /var/app/logs
RUN mkdir var/app/staticfiles
WORKDIR  /var/app

COPY ./Pipfile* /tmp/
RUN pip install -U pip
RUN pip install pipenv
RUN cd /tmp && pipenv requirements > requirements.txt
RUN pip install -r /tmp/requirements.txt

# Step 2: Copy Django Code
# ----------------------------------------

# Copy stuff in rarest-to-most-often order
# Files that should basically never change
COPY ./manage.py ./run_server_staging.sh ./
# Files that will change rarely
COPY ./templates ./templates
COPY ./config ./config
# Files that will change often
COPY ./apps ./apps
