---
title: Commands Memo
sidebar_position: 98
---

# Commands Memo

## Updates

When you pull the last changes from Github, you need to update your dependencies
and to apply the last changes on your local database. You can do all of this in one
command, runnable from the `nantralPlatform` directory:

```bash
make update
```

<details>
    <summary>But what does it do exactly? I'm curious!</summary>

The update runs the following commands:

- `npm install`: update the list of dependencies for the front end
- `pipenv install --dev`: update the list of dependencies for the back end
- `pipenv run migrate`: apply the last changes on your database

</details>

## The Back End

Here are the main commands to deal with the backend and django.

- `pipenv install --dev`: install all latest dependencies of the project
- `pipenv run start`: launch the django server
- `pipenv run test`: run all the tests of django
- `pipenv run makemigrations`: create the migration files
- `pipenv run migrate`: apply the new migration files
- `pipenv run format`: format all python code according to Pep8 style
- `pipenv run coverage-test`: do the same thing as `pipenv run test` but using the `coverage` package
- `pipenv run coverage report`: see a report about the coverage of tests (works only if run after `cover-test`)

Need more commands? You should find what you want here!

<details>
    <summary><strong>Pipenv</strong>: dependencies and virtual environment management</summary>

Firstly, here is how to deal with **dependencies** with Pipenv:

- `pipenv install --dev`: install all dependencies of the `Pipfile`,
  including the dev ones. It generates a `Pipfile.lock` file which will then
  be used for the server to deploy.
- `pipenv install <package>`: install a specific python package
- `pipenv update --outdated`: list all outdated packages
- `pipenv update`: update a package or all outdated packages

Then you can also manage your python **virtual environment** with Pipenv:

- `pipenv shell`: open the python virtual environment. You can then close it by executing `exit`
- `pipenv run <command>`: allow to execute one single command inside the virtual environement.
  It's faster than opening it each time!

Finally, Pipenv allows to define **shortcuts** to execute commands inside the virtualenv.
All shortcuts begin with `pipenv run`, follow by a key word. Some examples:

- `pipenv run start`: a shortcut for

  ```bash
  pipenv shell
  python manage.py runserver
  exit
  ```

- `pipenv run django <command>`: a shortcut for
  ```bash
  pipenv shell
  python manage.py <command>
  exit
  ```

You can list all the shortcuts by running `pipenv scripts`.

</details>

<details>
    <summary><strong>Django</strong>: server managments</summary>

### Use the django CLI

Django is the framework we use for serving the website, and it has many different commands.
All commands must be executed from the python virtuel environment, with the command
`python3 manage.py`. So you have 3 different ways to do this:

- Open the virtual environement, execute your command, and close the virtual environement:
  ```bash
  pipenv shell
  python3 manage.py <command>
  exit
  ```
- **Or** you can execute use the single-command execution of pipenv:
  ```bash
  pipenv run python3 manage.py <command>
  ```
- **Or**, if you are as lazy as us, you can use the shortcut we have defined to go faster:
  ```bash
  pipenv run django <command>
  ```

### Useful django commands

- `pipenv run django runserver`: Launch the server. When you edit the code of the backend,
  it automatically update the server. You can also use `pipenv run start` which does the same.
- `pipenv run django makemigrations`: create the migration files. You have to run it every time
  you change the structure of the database (in the `models.py` files)
- `pipenv run django migrate`: apply the previous migrations
- `pipenv run django test`: run the tests of django
- `pipenv run django startapp`: create a new application
- `pipenv run django createsuperuser`: create a user with admin rights

You can find all commands on the [Django documentation](https://docs.djangoproject.com/fr/4.0/ref/django-admin/).

</details>

## The Front End

The front end is a react application. The main commands you will have to use:

- `npm i` or `npm install`: install all the dependencies (or update them), including
  the dev ones.
- `npm run start`: start the live compilation in dev mode of the files. Each time you edit
  a file, the new file is automatically compiled. Note that you need to refresh
  your browser to take the changes into effect.
- `npm run build`: build the production compilation of the files. This is useful to check
  the weight of the files.

Then we also have the testing commands:

- `npm run types`: check the typescript types of your files!
- `npm run lint`: run eslint and prettier on all of your files to check for code smells
- `npm run jest`: run all the unit tests of the front end with jest
  - `npm run jest <filename>`: run the unit tests of a specific file
  - `npm run jest:u`: update the snapshots of the unit tests
- `npm run test`: run all of these 3 commands at once!
