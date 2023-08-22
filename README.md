![Test Back End](https://github.com/3cn-ecn/nantralPlatform/actions/workflows/quality.yml/badge.svg)
[![Deploy Server](https://github.com/3cn-ecn/nantralPlatform/actions/workflows/deploy-server.yml/badge.svg?branch=master)](https://nantral-platform.fr)
[![Deploy Staging](https://github.com/3cn-ecn/nantralPlatform/actions/workflows/deploy-staging.yml/badge.svg?branch=staging)](https://dev.nantral-platform.fr)
[![Deploy Docs](https://github.com/3cn-ecn/nantralPlatform/actions/workflows/deploy-docs.yml/badge.svg?branch=master)](https://docs.nantral-platform.fr)

# Nantral Platform

- Nantral Platform Website: [nantral-platform.fr](https://nantral-platform.fr)
- Documentation: [docs.nantral-platform.fr](https://docs.nantral-platform.fr)

## Get started

- Requirements: `python3`, `pipenv` (be sure its in your PATH!), and `node`
- Setup everything the first time:
  ```
  make install
  ```
- Update your local codebase with last changes:
  ```
  git pull
  make update
  ```
- Start the back end server:
  ```
  cd backend && pipenv run start
  ```
- Start the front end server (in another terminal):
  ```
  cd frontend && npm run start
  ```

## Create a local account

- Access the login page on [http://localhost:8000](http://localhost:8000) and
  create your account.
- Access the administration panel at
  [http://localhost:8000/admin](http://localhost:8000/admin) with the default
  login `admin/admin` and grant yourself admin rights (tick the 3 checkboxes).
- Log out from the administration panel, go back to the website and log in with
  your personal account.

> Warning: the admin account is not usable for the website (only for the
> administration panel), you have to create a local account to use the website.

> Debugging: if you can't connect to the admin account, change its password
> with `pipenv run django changepassword admin`

## Contribute

- [Create a [TICKET] issue](https://github.com/3cn-ecn/nantralPlatform/issues) to describe what you want to do. Assign yourself to the issue if you want to work on it.
- Create a new branch linked to the issue and then create a Pull Request.
- Test your code:
  - All-in-one command:
    ```bash
    make test
    ```
  - in the backend:
    ```bash
    pipenv run flake8 ./
    pipenv run test
    ```
  - in the frontend:
    ```bash
    npm run types
    npm run lint
    npm run jest
    ```
    _Run these 3 commands at once: `npm run test`_
