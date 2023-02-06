---
sidebar_position: 3
description: The Web framework for perfectionists with deadlines. 
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Django

* **[Official Documentation](https://docs.djangoproject.com/)** (tip: the downloadable PDF is easier to use)
* **[Recommended Tutorial (MDN)](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django)**

## Basic commands

:::caution
All the commands for django should be run from the `backend` directory.
:::

* **Start the server:** (the website is then accessible at [http://localhost:8000](http://localhost:8000))
  ```bash
  pipenv run start
  ```
* **Run the django tests:** (optionally for one app only)
  ```bash
  pipenv run test [appname]
  ```
* **Create the database migration files:** (optionally for one app only)
  ```bash
  pipenv run makemigrations [appname]
  ```
* **Apply the migration files and update your database:** (optionally for one app only)
  ```bash
  pipenv run migrate [appname]
  ```
* **Run any `django` command:** (this command replace `django-admin` or `python manage.py`):
  ```bash
  pipenv run django <command>
  ```

## Database, models and migrations

- Whenever you make a change to your database's structure (basically each time you modify one of the `models.py` file), you need to save the modifications of your database in a file so as to other users can know the database modifications. In the `backend` folder, run `pipenv run makemigrations` to automatically create these files
- Then, you can apply these modifications to your own database by running `pipenv run migrate`

Some good practices:

- The migration files are saved in the `migrations` folder in each app. Try to rename the migrations scripts to something more understandable for a human. Example : rename `migration01.py` to `create_news_model_alter_clubs.py`
- Try also to merge migrations into one migration as much as possible.
- Be careful: you can't change your migration files once you migrate your database. If you want to merge them before pushing your updates to the server for example, you'll have to destroy your database (simply delete the `db.sqlite3` file).

## Create a new server app

In django, all functionnalities are separeted in "apps". Each "app" correspond to a directory in the `server/apps` folder.

- To create a new app in the django server, use `pipenv run django startapp <app_name>`. This will create a new folder with the app name you chose.
- Then move the app folder to the main `apps` folder, so as to have all apps in the same place.
- **In your new app folder:**
  - Create or update a `urls.py` script inside the folder. Base this script on other `urls.py` you can find in other apps
  - Update the `apps.py` script, by replacing `name = 'app_name'` by `name = 'apps.app_name'`
- **Then in the `server/config` folder:**
  _ In the `urls.py` script, add a namespace for your app like this: `url('app_name/', include('apps.app_name.urls', namespace='app_name')),`. This will link the url router to your urls.py script in the app you created.
  _ Finally add the app in `settings/base.py`:
  `COMMON_APPS = [ 'apps.app_name', ]`
- Finally, some defaults tables have been added in your database: run the migrations, and then run the server!
    ```bash
    pipenv run migrate
    piepnv run start
    ```
