![Test Back End](https://github.com/3cn-ecn/nantralPlatform/actions/workflows/quality.yml/badge.svg)
[![Deploy Server](https://github.com/3cn-ecn/nantralPlatform/actions/workflows/deploy-server.yml/badge.svg?branch=master)](https://nantral-platform.fr)
[![Deploy Staging](https://github.com/3cn-ecn/nantralPlatform/actions/workflows/deploy-staging.yml/badge.svg?branch=staging)](https://dev.nantral-platform.fr)
[![Deploy Docs](https://github.com/3cn-ecn/nantralPlatform/actions/workflows/deploy-docs.yml/badge.svg?branch=master)](https://docs.nantral-platform.fr)


# Nantral Platform

- Nantral Platform Website: [nantral-platform.fr](https://nantral-platform.fr)
- Documentation: [docs.nantral-platform.fr](https://docs.nantral-platform.fr)

## Get started

- Requirements: `python3`, `pipenv` (be sure its in your PATH!), and `nodejs`
- Set up the project:
  ```
  make install
  ```
- Start the back end server:
  ```
  cd backend/ && pipenv run start
  ```
- Start the front end server (in another terminal):
  ```
  cd frontend/ && npm run start
  ```
- Access the login page on [http://localhost:8000](http://localhost:8000) and
  create your account.
- Access the administration panel at
  [http://localhost:8000/admin](http://localhost:8000/admin) with the default
  login `admin/admin` and grant yourself admin rights (tick the 3 checkboxes).
- Log out from the administration panel, go back to the website and log in with
  your personal account. Be careful: the admin account is not usable for the
  website (only for the administration panel), you have to create another
  account.

## Contribute

- Before pushing new changes, create a new branch linked to the issue you have worked on and then create a pull request. Explain in your PR what your changes are about.
- When you pull changes from the repository, update your local instance with:
  ```
  make update
  ```
- Test your code:
  ```
  make test
  ```

### For the back end

All these commands are done from the `backend` directory. Please first move into it with `cd ./backend/`.

- `pipenv run start`: launch the backend server
- `pipenv run django`: execute django operations from `manage.py` (equivalent to `pipenv run python manage.py`)
- Some shortcuts:
  - `pipenv run test`: run the django tests
  - `pipenv run makemigrations`: create migration scripts for the database (run it after making changes to the models)
  - `pipenv run migrate`: apply the migrations scripts to your database
- `pipenv run flake8 ./` : show all code smells in the given directory.
- `pipenv run autopep8`: autocorrect all code smells in the backend directory
- `pipenv install [--dev] <package_name>`: add a package to the (dev) dependencies

### For the front end

All these commands are done from the `frontend` directory. Please first move into it with `cd ./frontend/`.

- `npm run start`: start the live compilation in dev mode of the files. Each time you edit a file, the new file is automatically compiled.
- `npm run build`: build the production compilation of the files. This is useful to check the weight of the files.
- `npm run types`: test the types of the files.
- `npm run lint`: check the code smells of the files.
- `npm run jest`: run the tests of the files. Use also `npm run jest:u` to update snapshots.
- `npm run test`: run all of the 3 previous commands.
- `npm install --save[-dev] <package_name>`: add a package to the (dev) dependencies
