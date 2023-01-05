---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Setup the project

## Install dependencies

Open a terminal in the `nantralPlatform` directory (for convenience, you can
open this terminal inside of VS Code but it also works if you use your regular
terminal), and run:

<Tabs groupId="os">
<TabItem value="win" label="Windows">

Run on **PowerShell**:

```bash
make win-install
```

</TabItem>
<TabItem value="mac-lin" label="MacOS/Linux">

```bash
make unix-install
```

</TabItem>
</Tabs>

That's done! Everything should be installed.

<details>
    <summary>Help! The <code>make</code> command does not work with me! 😥</summary>

Well, sorry you're not lucky! But don't worry, here are all the steps you can do
to install everything.

1. Go into the `backend` directory:
    ```bash
    cd backend/
    ```

2. In the `backend/config/settings` directory, copy the file named `.env.example`
    and rename it `.env` only.

3. Install dependencies and create a virtuel environment for python:
    ```bash
    pipenv install --dev
    ```

4. Create your database for django:
    ```bash
    pipenv run migrate
    ```

5. Create an administrator acount on this database:
    ```bash
    pipenv run django createsuperuser
    ```
    When asked, complete as follow:
    - username: `admin` (or `admin2` if already used)
    - email: `admin@ec-nantes.fr`
    - password: `admin`

6. Now, change your working directory to the `frontend` one:
    ```bash
    cd ../frontend
    ```

7. Install the dependencies:
    ```bash
    npm install
    ```

8. Compile the source code for the first time:
    ```bash
    npm run build:dev
    ```

Congratulations, you did it all 🥳

</details>

## Launch the website

Now it's time to launch the website! To do this:
1. Go into the backend directory:
    ```bash
    cd backend/
    ```
2. Launch the backend server (django):
    ```bash
    pipenv run start
    ```
3. Open this address in your browser: [http://localhost:8000](http://localhost:8000)

And that's it! You should now see the login page of Nantral Platform:

![The login page](/login-page.png)

## Create your account

The website that you just launched does not use the real database of
Nantral Platform. Instead, for security reasons, an empty database has been
created during the installation process.
As a consequence, you have to **create an account** on your **local database**:

1. On the login page, click the *"Pas de compte ?"* button, and fill your info
    as you would do on the real website.

:::tip Remarks
- Your password will be only stored on your computer: hence, it will not be
really protected, so do not use a password similar to your real online
accounts. You can instead use a dummy password like `password`, as you want!
- The email will not really be checked, so you can use a dummy one too.
Just be sure that it finishes with `ec-nantes.fr`! This allows you to create
multiple accounts, to test your code later 😉
:::

2. Once your account is created, the validation email is sent... to the console!
    So go back to your terminal, and try to find the **validation link** in the
    logs. Copy and paste this link into your browser, and *voilà*, your account
    is validated! *(You may also need to remove the `s` of `https` in the link to make
    it work, depending of your browser.)*


3. Finally, we will make your new account an *administrator* account:
    1. On the local website and **log out** from your account
    2. Open [http://localhost:8000/admin](http://localhost:8000/admin), and
    connect yourself with username and password `admin / admin`
    3. You have now access to the *Administration Panel of Django*. In the
    **Authentification and authorisation** section, select **Users**
    4. You now have access to the list of all users. Note that some users
    already exists: they are fake accounts, just there to simulate some students.
    **Search** for your account and open it.
    5. In the *Permissions* section, check **Staff status** and
    **Superuser status** and then click on the **Save** button.
    6. That's it! 🥳 You are now a superuser, you can **log out** from the admin
    account, go back to [http://localhost:8000](http://localhost:8000), and log
    in with you own account!



:::info Why can I not directly use the *admin* account?

In facts, on Nantral Platform, we have 2 tables in our database for representing
a user: the first one is called `User`, and the second one `Student`. The
`User` table is made for the authentification and permissions processes, and the
`Student` one is made for the profile of the user.

The *admin* account is only created during the installation process as an
element of the `User` table, and has no equivalent in the `Student` table:
hence, the *admin* account will not really work on Nantral Platform. That's why
you need to create your account with the login page, to have both enabled.
:::
