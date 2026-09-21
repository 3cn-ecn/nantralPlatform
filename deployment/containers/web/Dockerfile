FROM python:3.13-slim-bookworm AS base
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

FROM base AS builder

ENV C_FORCE_ROOT 1
ENV DOCKER True
ENV DJANGO_SETTINGS_MODULE=config.settings.production
ENV PYTHONUNBUFFERED 1
ENV UV_NO_DEV=1
ENV UV_COMPILE_BYTECODE=1
ENV UV_SYSTEM_PYTHON=1
ENV UV_LINK_MODE=copy

# create unprivileged user
RUN adduser --disabled-password --gecos '' myuser

# Install PostgreSQL dependencies
# We have to install GCC as the slim and alpine base images do not come with gcc built in
RUN apt-get update && \
  apt-get install -y postgresql-client libpq-dev supervisor netcat-openbsd gcc memcached git gettext

# Step 1: Install any Python packages
# ----------------------------------------

RUN mkdir -p /var/app/logs
RUN mkdir var/app/staticfiles
WORKDIR  /var/app

# Install dependencies
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --locked --no-install-project

COPY ./pyproject.toml ./uv.lock ./

# Sync the project
RUN --mount=type=cache,target=/root/.cache/uv uv sync --locked

FROM builder AS development

COPY . .
CMD ["uv", "run", "manage.py", "runserver", "0.0.0.0:8000"]

FROM builder AS production

# Step 2: Copy Django Code
# ----------------------------------------

# Copy stuff in rarest-to-most-often order
# Files that should basically never change
COPY ./manage.py ./run_server.sh ./run_server_staging.sh ./
# Files that will change rarely
COPY ./templates ./templates
COPY ./config ./config
# Files that will change often
COPY ./apps ./apps
