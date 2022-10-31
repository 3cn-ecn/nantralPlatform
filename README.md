[![Deploy Server](https://github.com/3cn-ecn/nantralPlatform/actions/workflows/deploy-server.yml/badge.svg?branch=master)](https://nantral-platform.fr)
[![Deploy Staging](https://github.com/3cn-ecn/nantralPlatform/actions/workflows/deploy-staging.yml/badge.svg?branch=staging)](https://dev.nantral-platform.fr)
[![Deploy Docs](https://github.com/3cn-ecn/nantralPlatform/actions/workflows/deploy-docs.yml/badge.svg?branch=master)](https://docs.nantral-platform.fr)

![Test Django](https://github.com/3cn-ecn/nantralPlatform/actions/workflows/test-django.yml/badge.svg)
![Test Docs](https://github.com/3cn-ecn/nantralPlatform/actions/workflows/test-docs.yml/badge.svg)

# Nantral Platform

* Nantral Platform Website: [nantral-platform.fr](https://nantral-platform.fr)
* Documentation: [docs.nantral-platform.fr](https://docs.nantral-platform.fr)

## Get started

* Requirements: `python3`, `pipenv`, and `nodejs`
* Set up the project (for *Windows* users, replace `unix` by `win`):
    ```
    make unix-install
    ```
* Start the server:
    ```
    cd backend/ && pipenv run start
    ```
    The server is launch on [http://localhost:8000](http://localhost:8000). The administration panel is available at [http://localhost:8000/admin](http://localhost:8000/admin), with the default account `admin/admin`.

## Contribute

* Before pushing new changes, create a new branch linked to the issue you have worked on and then create a pull request. Explain in your PR what your changes are about.
* When you pull changes from the repository, update your local instance with:
    ```
    make update
    ```
* Test your code:
    ```
    make test
    ```
### For the back end

All these commands are done from the `backend` directory. Please first move into it with `cd ./backend/`.
* `pipenv run start`: launch the backend server
* `pipenv run django`: execute django operations from `manage.py` (equivalent to `pipenv run python manage.py`)
* Some shortcuts:
    * `pipenv run test`: run the django tests
    * `pipenv run makemigrations`: create migration scripts for the database (run it after making changes to the models)
    * `pipenv run migrate`: apply the migrations scripts to your database
* `pipenv run flake8 ./` : show all code smells in the given directory.
* `pipenv run autopep8`: autocorrect all code smells in the backend directory
* `pipenv install [--dev] <package_name>`: add a package to the (dev) dependencies

### For the front end

All these commands are done from the `frontend` directory. Please first move into it with `cd ./frontend/`.
* `npm run start`: start the live compilation in dev mode of the files. Each time you edit a file, the new file is automatically compiled.
* `npm run build`: build the production compilation of the files. This is useful to check the weight of the files.
* `npm run build:dev`: compile the files in dev mode (like the start option, except that it doesn't refresh when you edit a file).
* `npm install --save[-dev] <package_name>`: add a package to the (dev) dependencies