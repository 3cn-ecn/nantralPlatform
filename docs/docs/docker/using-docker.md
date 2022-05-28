---
title: Using Docker
sidebar_position: 1
---

# Using Docker

## How to run docker for local dev

1. Install docker-desktop from the official website: 
    [docs.docker.com/get-docker](https://docs.docker.com/get-docker/)
2. Add the *"docker needed"* variables in your `.env` environment file.
    It must be at this place: `backend/config/settings/.env`
2. Go to the `deployment` directory: `cd deployment/`
3. Create an empty file `backend.env` in this directory
3. Build the containers: `docker-compose build`
4. Start the services: `docker-compose up`
5. Try to connect to `http://localhost` in your browser. 

If you can access the login page, congratulations everything is ok! 🥳 

Let's create a superuser account now, so that you can connect. For this, follow the
tutorial [here](../get-started/setup-django.md#create-your-account). You only have to replace
the command for creating a superuser by:
``` 
docker-compose exec backend python3 manage.py createsuperuser
```
You can run this command in another terminal (but always in the `deployment` directory).

:::success Useful tips
* You can stop docker by pressing <kbd>CTRL</kbd>+<kbd>C</kbd> in the console if docker 
    is running, or by running the command `docker-compose down`.
* You can also launch docker services in background by adding the 
    `-d` argument on the up command. 
* If you want to be faster, you can run both command at once by 
    using `docker-compose up --build`
:::

:::note **What does it do?**
When you run `docker-compose` without specifying the files to run, it
runs by default `docker-compose.yml` and then `docker-compose.override.yml`.
It is equivalent to run:
```bash
docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build
```
In our case, the files are configured to run the backend (with django),
an instance of postgresql (the database), and the celery services (for
background tasks).
:::

## How to run docker for production

1. Go to the `deployment` directory.
2. Create the environment files at the root of this directory:
    * `backend.env` for all environment variables related to django
    * `mailu.env` for those related to the mail server
    * `frontend.env` for those related to the react frontend
3. Build and run the docker-compose files:
    ```bash
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
    ```

:::info 
Note that in practice, we will not stop and restart all services each
time we want to make an update. To do so, we can indicate which service 
we want to restart. For example, to restart only the backend:
```
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache nginx backend
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```
The `--no-cache` option allowed to delete the cache and be sure that 
all files are really updated.
:::

This will run:
* the django server (for the backend)
* the postgresql server (for the database)
* the celery tasks
* the mail server