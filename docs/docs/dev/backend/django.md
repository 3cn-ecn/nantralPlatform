---
sidebar_position: 3
description: The Web framework for perfectionists with deadlines.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Django

- **[Recommended Tutorial (MDN)](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django)**
- **[Official Documentation](https://docs.djangoproject.com/)** (tip: the downloadable PDF is easier to use)
- **[Source Code](https://github.com/django/django)** (tip: on Github, use the <kbd>.</kbd> shortcut to open the code in VSCode)

## Basic commands

:::caution Reminder
All the commands for django should be run from the `backend` directory.
:::

- **Start the server:** (the website is then accessible at [http://localhost:8000](http://localhost:8000))
  ```bash
  pipenv run start
  ```
- **Run the django tests:** (optionally for one app only)
  ```bash
  pipenv run test [app_label]
  ```
- **Create the database migration files:** (optionally for one app only)
  ```bash
  pipenv run makemigrations [app_label]
  ```
- **Apply the migration files and update your database:**
  ```bash
  pipenv run migrate
  ```
- **Run any `django` command:** (this command replace `django-admin` or `python manage.py`):
  ```bash
  pipenv run django <command>
  ```

## Database, models and migrations

- The structure of the database is defined in the `models.py` files: each
  _django app_ can have multiple tables, defined as python classes.
- Whenever you make a change to your database's structure (basically each time
  you modify one of the `models.py` file), you need to create a migration file
  to detect the changes in the database structure. Hopefully, django can create
  these files automatically with this command (replace `[app_label]` with the
  label of your django app):
  ```bash
  pipenv run makemigrations [app_label]
  ```
- Then, you can apply these changes to your own database by running:
  ```bash
  pipenv run migrate
  ```

:::info Some good practices

- Try to **merge** migration files into one file as much as possible: we
  try to have as few migration files as possible (to do so, just _unapply_
  your last migrations files, delete them, and recreate a new migration file).
- Be careful: you can't change migration files once they are uploaded to
  the `master` branch on the server.

:::

<details>
<summary>More on migrations...</summary>

- **Write custom migrations**: you can write custom migrations, for example
  to transfer or copy data from one _table_ to another. First, create an empty
  migration file with:
  ```bash
  pipenv run makemigrations <app_label> --empty --name <file_name>
  ```
  Then, go to the `migrations` directory, and edit the new created file
  to implement your custom migrations (see [this documentation](https://docs.djangoproject.com/en/4.1/howto/writing-migrations/)
  about how to write custom migrations).
- **Apply only some migrations**: you can specify
  which migration files to apply by specifying the app or the file:
  ```bash
  pipenv run migrate <app_label> [migration_name]
  ```
- **Unapply a migration**: you can unapply a migration and reverse your database
  to the previous state. This is very useful when you want to merge migrations,
  for example. To do so, just run:
  ```bash
  pipenv run migrate <app_label> <migration_name>
  ```
  where `<migration_name>` is the name of the migration just before the one
  you want to unapply: this will reverse the state of your database to the state
  just after this migration. Note that you can also only specify the number of the
  migration, and not the full name (for example, `pipenv run migrate event 0004`
  works).

</details>

## Create a new app

In django, all functionalities are separated into **apps**. Each app correspond
to a directory in the `server/apps` folder.

To create a new app:

1. Create a new empty app folder with the django command:

   ```bash
   pipenv run django startapp <app_name>
   ```

2. Then move this new app folder to the main `apps` folder, so as to have all
   apps in the same place.
3. **Inside your new app folder:**
   - Create a `urls.py` script. You can copy the structure of `urls.py` from other apps.
   - Update the `apps.py` script, by replacing `name = 'app_name'` by `name = 'apps.app_name'`
4. **Inside the `backend/config` folder:**
   - In the `urls.py` script, add a namespace for your app like this:
     ```python
     url('app_name/', include('apps.app_name.urls', namespace='app_name')),
     ```
     This will link the url router to your urls.py script in the app you created.
   - Then add your app in `settings/base.py`:
     ```python
     COMMON_APPS = [ 'apps.app_name', ]
     ```
5. Finally, we need to update your database:
   ```bash
   pipenv run migrate
   ```
