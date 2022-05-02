# Docker management

## How to run docker for local dev

1. Install docker-desktop from the official website: 
    [docs.docker.com/get-docker](https://docs.docker.com/get-docker/)
2. Add the *"docker needed"* variables in your environment file (see the
    `sample_env.txt` example). Your environment file must be at this place: `backend/config/settings/.env`
2. Go to the `deployment` directory: `cd deployment/`
3. Create an empty file `backend.env` in this directory
3. Build the containers: `docker-compose build`
4. Start the services: `docker-compose up`

Useful tips:
* You can stop docker by pressing `CTRL+C` in the console if docker 
    is running or by running the command `docker-compose down`.
* You can also launch docker services in background by adding the 
    `-d` argument on the up command. 
* If you want to be faster, you can run both command at once by 
    using `docker-compose up --build`

> **What does it do?**
>
> When you run `docker-compose` without specifying the files to run, it
> runs by default `docker-compose.yml` and then 
> `docker-compose.override.yml`.
> 
> It is equivalent to run:
> ```bash
> $ docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build
> ```
> 
> In our case, this files are configured to run the backend (with django),
> an instance of postgresql (the database), and the celery services (for
> background tasks).
>


---

## How to run docker for production

1. Go to the `deployment` directory.
2. Create the environment files at the root of this directory:
    * `backend.env` for all environment variables related to django
    * `mailu.env` for those related to the mail server
    * `wiki.env` for those related to the wiki
    * `frontend.env` for those related to the react frontend
3. Build and run the docker-compose files:
    ```bash
    $ docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
    ```

> Note that in practice, we will not stop and restart all services each
> time we want to make an update. To do so, we can indicate which service 
> we want to restart. For example, to restart only the backend:
> ```
> $ docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache nginx backend
> $ docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
> ```
> The `--no-cache` option allowed to delete the cache and be sure that 
> all files are really updated.
>

These files make run:
* the django server (for the backend)
* the postgresql server (for the database)
* the celery tasks
* the mail server
* the wiki of nantral platform