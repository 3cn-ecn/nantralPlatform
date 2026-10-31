ARG NODE_VERSION=26

# Step 1: Get frontend dependencies and cache them
FROM node:${NODE_VERSION} AS frontend-deps
RUN mkdir -p /var/app/frontend
WORKDIR /var/app/frontend
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline

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
    npm ci --omit=dev --prefer-offline

# Step 4: Build email templates
FROM email-templates-deps AS email-templates-builder
COPY ./email-templates-generator/ ./
RUN npm run build

# DEV: Run frontend
FROM frontend-deps AS frontend-development
COPY ./frontend/ ./
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]

# Step 5: Create backend build image
FROM python:3.13-slim-bookworm AS backend-builder
COPY --from=ghcr.io/astral-sh/uv:0.12.18 /uv /bin/

ENV DOCKER=True
ENV DJANGO_SETTINGS_MODULE=config.settings.production
ENV PYTHONUNBUFFERED=1
ENV UV_NO_DEV=1
ENV UV_PROJECT_ENVIRONMENT="/opt/venv"
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

WORKDIR /var/app
COPY ./backend/pyproject.toml ./backend/uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-install-project

# DEV: Run backend
FROM backend-builder AS backend-development
ENV DJANGO_SETTINGS_MODULE=config.settings.docker
ENV UV_NO_DEV=0
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --all-groups
COPY ./backend/ .
# Built emails templates
COPY --from=email-templates-builder /var/app/backend/templates/emails ./templates/emails
RUN adduser --disabled-password --gecos '' myuser && \
    chown -R myuser:myuser /var/app /opt/venv
USER myuser
CMD ["uv", "run", "manage.py", "runserver", "0.0.0.0:8000"]

# Step 6: Build production image with django and react files
# Only runtime packages and generated/application files are copied below.
FROM python:3.13-slim-bookworm AS runtime-base
ENV DOCKER=True
ENV DJANGO_SETTINGS_MODULE=config.settings.production
ENV PYTHONUNBUFFERED=1
ENV PATH="/opt/venv/bin:${PATH}"
# Install Runtime dependencies
RUN apt-get update && \
  apt-get install -y --no-install-recommends gettext netcat-openbsd && \
  rm -rf /var/lib/apt/lists/*
WORKDIR /var/app
RUN mkdir -p logs staticfiles
# Copy stuff in rarest-to-most-often order
# Files that should basically never change
COPY --from=backend-builder /opt/venv /opt/venv
COPY ./backend/manage.py ./backend/run_server.sh ./
RUN chmod +x run_server.sh
# Files that will change rarely
COPY ./backend/templates ./templates
COPY ./backend/config ./config
# Files that will change often
COPY ./backend/apps ./apps

# Built emails templates
COPY --from=email-templates-builder /var/app/backend/templates/emails ./templates/emails

# Build translations
RUN python manage.py compilemessages -l fr -l en

# create unprivileged user
RUN adduser --disabled-password --gecos '' myuser
RUN chown -R myuser:myuser /var/app
USER myuser

# Celery: special image with only runtime dependencies and backend files
FROM runtime-base AS celery

# Step 7: Add frontend files to create the final image
FROM runtime-base AS production
# Built files from frontend
COPY --chown=myuser:myuser --from=frontend-builder /var/app/backend/static/front /var/app/static/front
# Prepare Django
RUN python manage.py collectstatic --noinput
CMD ["./run_server.sh"]
