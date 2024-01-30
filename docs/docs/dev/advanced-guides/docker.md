---
sidebar_position: 4
---

# Docker

## Why using docker on local development?

Docker is used to manage the code on our server. By using it on your local
machine, you will be able to reproduce an environment very close to the
deployment one, and so it will be easier to track issues before they appear.

In practice, using Docker on your local machine will allow you to:

- **Use the cache system**: Django comes with a cachin system, that you can
  only use with Docker
- **Use the Postgres database**: by default the database uses SQLite, but
  the deployment database uses postgresql, and so Docker does
- **Use the celery service**: the celery service allow you to run asynchronous
  tasks on the server from the backend
- **Uses more debug tools**: with Docker, you can for instance access directly
  your database using PgAdmin for example, or use the Workers Dashboard for
  celery tasks

## How to run docker for local dev

1. Install docker-desktop from the official website:
   [docs.docker.com/get-docker](https://docs.docker.com/get-docker/)
2. Add the _"docker needed"_ variables in your `.env` environment file.
   It must be at this place: `backend/config/settings/.env`
3. Go to the `deployment` directory: `cd deployment/`
4. Create an empty file `backend.env` in this directory
5. Build the containers: `docker-compose build`
6. Start the services: `docker-compose up`
7. Try to connect to `http://localhost` in your browser.

If you can access the login page, congratulations everything is ok! 🥳

Let's create a superuser account now, so that you can connect. For this, follow the
tutorial [here](../get-started/setup-project/setup-project.md#create-your-account). You only have to replace
the command for creating a superuser by:

```bash
docker-compose exec backend python3 manage.py createsuperuser
```

You can run this command in another terminal (but always in the `deployment` directory).

:::success Useful tips

- You can stop docker by pressing <kbd>CTRL</kbd>+<kbd>C</kbd> in the console if docker
  is running, or by running the command `docker-compose down`.
- You can also launch docker services in background by adding the
  `-d` argument on the up command.
- If you want to be faster, you can run both command at once by
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

## Which services are launch?

These services are launch when you run Docker on your local machine:

| Service           | Description                                            | Access                                                                                                                                                                |
| ----------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| database          | The postgresql database for the website                | You can read it by connecting to the port 5432 on localhost with [PgAdmin4](https://www.pgadmin.org/download/), and using the credentials defined in your `.env` file |
| backend           | The django server which serve files                    | Open [http://localhost](http://localhost) in your browser                                                                                                             |
| nginx             | Used to serve the backend and the static files         | -                                                                                                                                                                     |
| redis             | Used for the django cache system                       | -                                                                                                                                                                     |
| celery            | Used for asynchronous tasks runned in background       | -                                                                                                                                                                     |
| celery-beat       | Used for linking celery to the backend with django     | -                                                                                                                                                                     |
| workers-dashboard | A dashboard to see all the celery tasks                | Open [http://localhost:5555](http://localhost:5555) in your browser                                                                                                   |
| mailpit           | An email server to show emails sent by django in local | Open [http://localhost:8025](http://localhost:8025) in your browser                                                                                                   |

## How to run docker for production server

1. Go to the `deployment` directory.
2. Create the environment files at the root of this directory:
   - `backend.env` for all environment variables related to django
   - `mailu.env` for those related to the mail server
   - `frontend.env` for those related to the react frontend
3. Build and run the docker-compose files:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
   ```

:::info
Note that in practice, we will not stop and restart all services each
time we want to make an update. To do so, we can indicate which service
we want to restart. For example, to restart only the backend:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache nginx backend
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

The `--no-cache` option allowed to delete the cache and be sure that
all files are really updated.
:::
