---
title: Set up Django
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Setup Django

Now that your computer is ready, let's start with django! Be sure you installed all the programs before
(see [Install Party](install-party.md)) and set up them (see [Set up the project](setup-project.md)).

:::note
In this tutorial, we will use the `python3` command for python. You might need to replace it by `python`, `py`,
or `py -3` (see the [Python Installation](install-party.md#python)).
The same thing applies to the `pip` command (see the [Pip Installation](install-party.md#pip)).

We also suppose that you know how to use a terminal and espacially how to change the directory. If it is not the case,
you can read the introduction of the [Install Party](install-party.md).
:::

## Create a virtual environment

<Tabs groupId="os">
<TabItem value="win" label="Windows">

1. In VSCode, click on the **Terminal** tab, then on **New Terminal**.
2. In the terminal, change your directory to the **backend** directory:
  ```bash
  cd backend
  ```
3. Create a virtualenv named `env` by running:
  ```bash
  python3 -m virtualenv env
  ```
4. Activate the virtulenv:
    * If you use CMD, run
      ```bash
      env\Scripts\activate.bat
      ```
    * If you use Powershell, run
      ```bash
      env\Scripts\activate.ps1
      ```
      *If you have an error, run `Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser`.*

:::success Check the activation
If the activation succeds, you will notice a `(env)` indicator at the beginning of the command prompt.
:::

5. Install all the dependencies of the nantral platform project:
  ```bash
  pip install -r requirements.txt
  ```
6. Create the database:
  ```bash
  python3 manage.py migrate
  ```

If you don't see any errors, you're done. Congratulations! 🥳 You can move on to the next step.

</TabItem>
<TabItem value="mac-lin" label="MacOS/Linux">

:::info For more advanced users
You can skip all the following steps by using the `install.sh` script in the `backend` directory.
It will execute for you all of the following steps to create the virtual environment.
To achieve this, open a new terminal in VS Code, and run
```bash
cd backend/ && ./install.sh
```
The virtualenv should be activated at the end of the script.
:::

1. In VSCode, click on the **Terminal** tab, then on **New Terminal**.
2. In the terminal, change your directory to the **backend** directory:
  ```bash
  cd backend
  ```
3. Create a virtualenv named `env` by running:
  ```bash
  python3 -m virtualenv env
  ```
4. Activate the virtulenv:
  ```bash
  source env/scripts/activate
  ```
:::success Check the activation
If the activation succeds, you will notice a `(env)` indicator at the beginning of the command prompt.
:::
6. Install all the dependencies of the nantral platform project:
  ```bash
  pip install -r requirements.txt
  ```
7. Create the database:
  ```bash
  python3 manage.py migrate
  ```

If you don't see any errors, you're done. Congratulations! 🥳 You can move on to the next step.

</TabItem>
</Tabs>

## Create the *.env* file

On the server, we need some passwords in our code. But for security issues, these passwords can't be synchronized on
Github. That's why you have to add these settings yourself, with your own passwords. Don't panic if you don't have ones:
you can let them blank if you do not want to developp the corresponding functions.

1. In VSCode, create a new file named `.env` inside the folder `backend/config/settings`.
2. Inside it, copy and paste the content of the `.env.example` file located in `backend/config/settings`.

## 5. Compiling the React code

1. Inside VSCode, open another terminal using the _Terminal_ tab.
2. In this terminal, type `cd frontend` to change your directory to the `frontend` directory.
3. Run `npm install` to install dependencies. This might take a minute.
4. Then run `npm run dev` to compile the code into the `backend/static/js` folder.
5. If you don't see any errors, you can close the terminal.

## 6. Running the backend

1. Go back to the VScode terminal in the `backend` folder.
2. Your virtualenv should have automatically been activated (notice the `(env)` at the far left of the command prompt). If you don't see it, activate your virtualenv using the instructions in the dedicated section at the end of this page.
3. Create an administrator account with `python3 manage.py createsuperuser`.
4. Run `python3 manage.py runserver`.
5. Congratulations ! You can now access the website at [http://localhost:8000](http://localhost:8000) 🥳
6. Press <kbd>CTRL</kbd> + <kbd>C</kbd> in the terminal to stop the backend.

# Commands you will use everyday

_Now that Nantral Platform development environment is installed, we'll take a closer look to the commands you will have to use each time you developp something on the application._

## 1. Launch the server

Suppose that during your coffee break, Windows made an update an restarted your computer. How to run the server again whitout reinstalling erveything like above ?

1. If you use Github Desktop, open it, then open the repository in VScode. Else, directly open the directory in VScode.
2. Open a new terminal in VScode if there is no one (_Terminal_ tab > _New terminal_)
3. Go into the `backend` folder with `cd` command
4. Activate your virtualenv (see the dedicated section below, at the end)
5. Visit your local website at [http://localhost:8000](http://localhost:8000), or shutdown the server with <kbd>CTRL</kbd> + <kbd>C</kbd>.

## 2. Pull last updates

When someone else make some updates, you make a `pull` with git to update your local copy of nantral platform (e.g. with Github Desktop, or git in VScode, or git in command line). When you pull last updates, you will probably have to:

- **update your python dependencies:** in the `backend` folder, run `pip3 install -r requirements.txt`
- **update your database:** in the `backend` folder, run `python3 manage.py migrate`
- **update your React dependencies:** in the `frontend` folder, run `npm install`
- **update your compiled React files:** in the `frontend` folder, run `npm run dev`

## 3. Migrations

- Whenever you make a change to your database's structure (basically each time you modify one of the `models.py` file), you need to save the modifications of your database in a file so as to other users can know the database modifications. In the `backend` folder, run `python3 manage.py makemigrations` to automatically create these files
- Then, you can apply these modifications to your own database by running `python3 manage.py migrate`

Some good practices:

- The migration files are saved in the `migrations` folder in each app. Try to rename the migrations scripts to something more understandable for a human. Example : rename `migration01.py` to `create_news_model_alter_clubs.py`
- Try also to merge migrations into one migration as much as possible.
- Be careful: you can't change your migration files once you migrate your database. If you want to merge them before pushing your updates to the server for example, you'll have to destroy your database (simply delete the `db.sqlite3` file).

## 4. Creating a new server app

In django, all functionnalities are separeted in "apps". Each "app" correspond to a directory in the `server/apps` folder.

- To create a new app in the django server, use `python manage.py startapp app_name`. This will create a new folder with the app name you chose.
- Then move the app folder to the main `apps` folder, so as to have all apps in the same place.
- **In your new app folder:**
  - Create or update a `urls.py` script inside the folder. Base this script on other `urls.py` you can find in other apps
  - Update the `apps.py` script, by replacing `name = 'app_name'` by `name = 'apps.app_name'`
- **Then in the `server/config` folder:**
  _ In the `urls.py` script, add a namespace for your app like this: `url('app_name/', include('apps.app_name.urls', namespace='app_name')),`. This will link the url router to your urls.py script in the app you created.
  _ Finally add the app in `settings/base.py`:
  `COMMON_APPS = [ 'apps.app_name', ]`
  Some defaults tables have been added in your database: run the migrations (see section 3), and then run the server!

## 5. Developp the frontend

For the frontend part, all informations are explained on the dedicated page: [Frontend with React](../setup-react).

## 6. Manage your virtualenv

A virtualenv allow you to have certain requirements versions for a project which are differents from the ones you have on your computer.

### a) Create a virtualenv

First you have to enable the functionnality by installing the package `virtualenv` whith pip: `python3 -m pip install virtualenv`. Then you can create a virtualenv in a folder by running `python3 -m virtualenv env`, where `env` is your virtualenv name. For this project, we create the virtualenv in the `server` directory.

### b) Activate a virtualenv

You need to activate your virtualenv before doing anything using Python about the project. Once the virtualenv is activated, you will notice the `(env)` at the far left of the command prompt.

#### Activate a virtualenv {.tabset}

##### MacOS/Linux

- Go to the folder which contains your virtualenv: `cd backend`
- Run `source env/bin/activate`

##### Windows (with CMD)

- Go to the folder which contains your virtualenv: `cd backend`
- Run `env\Scripts\activate.bat`

##### Windows (with Powershell)

- Go to the folder which contains your virtualenv: `cd backend`
- Run `env\Scripts\activate.ps1`

### c) Deactivate a virtualenv

Close your virtualenv with `deactivate` anywhere.

### d) Alternative: virtualenvwrapper

Alternatively, you can use `virtualenvwrapper` to easily manage several virtualenv. Follow the [instructions here](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/development_environment#using_django_inside_a_python_virtual_environment) to install it. Once installed, you can use:

- `mkvirtualenv env_name` to create a virtual env
- `workon env_name` to activate a virtual env (it doesn't depends on the current folder you're in)
- `deactivate` to close the virtual env

Since the installation is a little more tricky, we do not recommand this for beginners; however, if you succeed to install it before (for example doing the MDN tutorial), you can use it if you prefere.
