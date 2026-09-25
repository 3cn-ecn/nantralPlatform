ARG NODE_VERSION=26

# Step 1: Get frontend dependencies and cache them
FROM node:${NODE_VERSION} AS frontend-deps
RUN mkdir -p /var/app/frontend
WORKDIR /var/app/frontend
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Step 2: Build frontend
FROM frontend-deps AS frontend-builder
COPY ./frontend/ ./
RUN npm run build

# Step 3: Get email templates dependencies and cache them
FROM node:${NODE_VERSION} AS email-templates-deps
RUN mkdir -p /var/app/email-templates-generator
WORKDIR /var/app/email-templates-generator
COPY ./email-templates-generator/package.json ./email-templates-generator/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Step 4: Build email templates
FROM email-templates-deps AS email-templates-builder
COPY ./email-templates-generator/ ./
RUN npm run build

# DEV: Run frontend
FROM frontend-deps AS frontend-development
COPY ./frontend/ ./
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]

# Step 5: Create backend build image
FROM python:3.13-slim-bookworm AS backend-base
COPY --from=ghcr.io/astral-sh/uv:0.12.18 /uv /uvx /bin/

ENV DOCKER=True
ENV DJANGO_SETTINGS_MODULE=config.settings.production
ENV PYTHONUNBUFFERED=1
ENV UV_NO_DEV=1
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy
# create unprivileged user
RUN adduser --disabled-password --gecos '' myuser
# Install Runtime dependencies
RUN apt-get update && \
  apt-get install -y --no-install-recommends postgresql-client netcat-openbsd memcached gettext

# Step 6: Get backend dependencies
FROM backend-base AS backend-deps
# We have to install GCC as the slim and alpine base images do not come with gcc built in
RUN apt-get update && \
  apt-get install -y --no-install-recommends libpq-dev gcc
WORKDIR /var/app
RUN mkdir -p logs staticfiles && \
    chown -R myuser:myuser /var/app
USER myuser
COPY ./backend/pyproject.toml ./backend/uv.lock ./
# Sync the project (no-install-project because we do not create a package)
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-install-project

# DEV: Run backend
FROM backend-deps AS backend-development
ENV DJANGO_SETTINGS_MODULE=config.settings.docker
COPY ./backend/ .
CMD ["uv", "run", "manage.py", "runserver", "0.0.0.0:8000"]

# Step 7: Build production image with django and react files
FROM backend-deps AS production
# Copy stuff in rarest-to-most-often order
# Files that should basically never change
COPY --chown=myuser:myuser ./backend/manage.py ./backend/run_server.sh ./
RUN chmod +x run_server.sh
# Files that will change rarely
COPY --chown=myuser:myuser ./backend/templates ./templates
COPY --chown=myuser:myuser ./backend/config ./config
# Files that will change often
COPY --chown=myuser:myuser ./backend/apps ./apps

# Built files from frontend
COPY --chown=myuser:myuser --from=frontend-builder /var/app/backend/static/front ./static/front
# Built emails templates
COPY --chown=myuser:myuser --from=email-templates-builder /var/app/backend/templates/emails ./templates/emails

# Prepare Django
RUN uv run manage.py collectstatic --noinput
# Build translations
RUN uv run manage.py compilemessages -l fr -l en

CMD ["./run_server.sh"]

# Celery: special image with only backend files for celery
# Used in Prod AND Dev
FROM backend-deps AS celery
# Files that should basically never change
COPY ./backend/manage.py ./
# Files that will change rarely
COPY ./backend/templates ./templates
COPY ./backend/config ./config
# Files that will change often
COPY ./backend/apps ./apps
