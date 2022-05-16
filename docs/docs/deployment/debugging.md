---
title: Debugging in production
description: "How to debug your code in production"
published: true
date: 2022-05-06T16:15:20.602Z
editor: markdown
dateCreated: 2021-09-27T21:29:14.925Z
---

# Debugging in production

There are several failure points that we can look into to try and find the cause of a bug.

## Deployment logs

If a problem happens during deployment, you can check the status of the GitHub Action responsible for deploying the latest pull request to production [here](https://github.com/nantral-platform/nantralPlatform/actions). This should provide enough informations for deployment related issues.

The deployment pipeline is split into two parts:

1. Building the containers swarm.
2. Running the containers.

We will see how to debug both processes.

> In the following section, all `docker-compose` commands **in production** are replaced with the alias `dcf` which stands for `docker-compose -f docker-compose.yml -f docker-compose.prod.yml`
> {.is-info}

### Errors while building

The build logs should be available in the GitHub Action logs like described above.
If you need more informations, re-run the build directly on the server:

1. Connect to the server using SSH.
2. Go to nantralPlatform/deployment by running `cd nantralPlatform/deployment`.
3. Run `sudo dcf build` to re-build the containers.

### Errors while running the containers

Even if the docker-compose build ran successfuly, containers can still be prone to errors. If an error happens, you can debug the swarm by following the steps below:

1. Connect to the server using SSH.
2. Go to nantralPlatform/deployment by running `cd nantralPlatform/deployment`.
3. Run `dcf logs --follow`.
4. Press ctrl+C to exit.

If the containers are not running, use: `dcf up` to bring them online.

Once you are done debugging, press ctrl+C to exit and then run `dcf down && dcf up -d` to bring the containers back online in detached mode.

## Django production logs

If a bug happens in the backend code (i.e a 500 error), you can most likely find its traceback in the container's logs.

1. Connect to the server using SSH.
2. Run `dcf logs backend --follow`.
3. Once you are done, press CTRL+C to exit.
