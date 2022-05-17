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

Finally, all the commands of this page must be run in the `backend` directory, which is the directory for django. 
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

If you don't see any errors, you're done. Congratulations! 🥳 You can move on to the next step.

</TabItem>
</Tabs>

## Create the *.env* file

On the server, we need some passwords in our code. But for security issues, these passwords can't be synchronized on
Github. That's why you have to add these settings yourself, with your own passwords. Don't panic if you don't have ones:
you can let them blank if you do not want to developp the corresponding functions.

1. In VSCode, create a new file named `.env` inside the folder `backend/config/settings`.
2. Inside it, copy and paste the content of the `.env.example` file located in `backend/config/settings`.

## Create the database

All the source code of the database is already written in Django. All you use to do to set it up is
to run the following command, in the `backend` folder:

```bash
python3 manage.py migrate
```

The database created is in SQLite format: you will see a new file in the `backend` directory, named
`db.sqlite3`: this file contains **your** database, you can delete it if you want to reset your database.

:::note
This database is yours, and is totally different of the database of the server. This allows you to make plainty
of tests on a database, without making errors on the real one.
:::

## Launch the server!

In the `backend` directory, run the following command to launch the server:
```bash
python3 manage.py runserver
```

If everything is ok, you should see the following text:
```js
Running dev settings
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
May 17, 2022 - 21:38:32
Django version 3.2.13, using settings 'config.settings.dev_local'
// highlight-next-line
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

Now you can go in your browser and open [http://localhost:8000](http://localhost:8000): congratulations, 
django is running on your computer! 🥳🥳

You can stop it by pressing <kbd>CTRL</kbd>+<kbd>C</kbd>.

## Create your account

Since the database is newly created, you don't have an account yet on the site. Let's create one!

1. First, we will create an admin account. Run
  ```bash
  python3 manage.py createsuperuser
  ```
  It will then ask you the following fields:
    * `username`: enter `admin`
    * `email`: left empty
    * `password`: enter `admin`

2. Next, let's create your personal account: in your browser, open the site on the localhost and go to the login
  page. The, create an account as you can do on the real website.
  :::note
  For the email, you must enter an email which ends by `.ec-nantes.fr`, but it does need to be a real one:
  in facts, the verification email will not be sent, but will be prompted to the console.
  Once your account is created, you can then go into the console and copy the verification link 
  to activate the account.

  With this method, you can create as many accounts as you wish.
  :::

3. Finally, we will make your new account an admin account:
    1. On the local website, **log out** from your account
    2. Open [http://localhost:8000/admin](http://localhost:8000/admin), and connect yourself with the username and
      the password `admin / admin` (the one we created at first)
    3. You have now access to the *Administration Panel of Django*. In the **Authentification and authorisation** section,
      select **Users**
    4. You now have access to the list of all users. Note that some users already exists: they are fake accounts,
      just there to simulate the students. **Search** for your account and open it.
    5. In the *Permissions* section, check **Staff status** and **Superuser status** and then click on the **Save** button.
    6. That's it! 🥳 You are now a superuser, you can disconnect from the admin account and connect with your own account
      on the login page of the website. 

:::info Why not using the first command to create my account with admin privileges?

In facts, on Nantral Platform, we have 2 tables in our database for representing a user: the first one
is called *User*, and the second one *Students*. The *User* table is made for the authentification and permissions
processes, and the *Students* one is made for the profile of the user.

When you create an acount with the `createsuperuser` command, it only creates a new element in the `User` table,
and not in the `Students` table: that's why you need to create your account with the login page, to have both 
enabled.
:::