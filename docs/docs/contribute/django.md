---
title: Django
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# How to use Django

Now that Nantral Platform development environment is installed, we'll take a closer look to the commands you will have 
to use each time you developp something on the application.

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

## 5. Manage your virtualenv

A virtualenv allow you to have certain requirements versions for a project which are differents from the ones you have on your computer.

### a) Create a virtualenv

First you have to enable the functionnality by installing the package `virtualenv` whith pip: `python3 -m pip install virtualenv`. Then you can create a virtualenv in a folder by running `python3 -m virtualenv env`, where `env` is your virtualenv name. For this project, we create the virtualenv in the `server` directory.

### b) Activate a virtualenv

You need to activate your virtualenv before doing anything using Python about the project. Once the virtualenv is activated, you will notice the `(env)` at the far left of the command prompt.

<Tabs>
<TabItem value="mac-lin" label="MacOS/Linux">

- Go to the folder which contains your virtualenv: `cd backend`
- Run `source env/bin/activate`

</TabItem>
<TabItem value="win-cmd" label="Windows (CMD)">

- Go to the folder which contains your virtualenv: `cd backend`
- Run `env\Scripts\activate.bat`

</TabItem>
<TabItem value="win-ps1" label="Windows (Powershell)">

- Go to the folder which contains your virtualenv: `cd backend`
- Run `env\Scripts\activate.ps1`

</TabItem>
</Tabs>

### c) Deactivate a virtualenv

Close your virtualenv with `deactivate` anywhere.

### d) Alternative: virtualenvwrapper

Alternatively, you can use `virtualenvwrapper` to easily manage several virtualenv. Follow the [instructions here](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/development_environment#using_django_inside_a_python_virtual_environment) to install it. Once installed, you can use:

- `mkvirtualenv env_name` to create a virtual env
- `workon env_name` to activate a virtual env (it doesn't depends on the current folder you're in)
- `deactivate` to close the virtual env

Since the installation is a little more tricky, we do not recommand this for beginners; however, if you succeed to install it before (for example doing the MDN tutorial), you can use it if you prefere.
