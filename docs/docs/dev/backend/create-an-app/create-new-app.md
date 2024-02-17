---
sidebar_position: 1
description: How to create a new app
---

# Create the new app

Let's start by creating a new app with the django command-line tool:

1. Create a new empty app with the django command:

   ```bash
   cd apps
   pipenv run django-admin startapp <app_name>
   ```

   For this example, let's assume we created an app called `event`.

2. Now open the `apps.py` file in your `<app_name>` folder, and
   add _`apps.`_ to the name attribue:

   ```python title="backend/apps/event/apps.py"
   from django.apps import AppConfig

   class EventConfig(AppConfig):
   # highlight-next-line
       name = 'apps.event'  # add 'apps.' to the name attribute
   ```

3. Then, add your app to the `INSTALLED_APPS` list in the django `settings`:

   ```python title="backend/config/settings/base.py"
   DJANGO_APPS = # ...
   THIRD_PARTY_APPS = # ...
   COMMON_APPS = [
      # ...
      "apps.event",
   ]
   INSTALLED_APPS = DJANGO_APPS + COMMON_APPS + THIRD_PARTY_APPS
   ```

4. Finally, we need to update your database:
   ```bash
   pipenv run migrate
   ```
