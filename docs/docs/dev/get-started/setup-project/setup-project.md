---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Run the project

It's time to run *Nantral Platform* on your computer!

## First launch

Open a terminal in the `nantralPlatform` directory (for convenience, you can
open this terminal inside of VS Code but it also works if you use your regular
terminal), and run:

```bash
make install
```

It creates a new virtual environment and installs all the dependencies for the
*back end* and the *front end*, and creates a new database for you with a
default `admin` user.

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
    If you get an error with the Python version, install [pyenv](https://github.com/pyenv/pyenv).

4. Create your database for django:
    ```bash
    pipenv run django migrate
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

## Start the server

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

![The login page](./login-page.png)

## Create your account

Since we have created your own database, you do **not** have an account yet
on this particular database. So let's create one!

1. On the login page, **click the *"No Account?"*** button, and fill in your
    info as you would do on the real website.

    :::tip Notes
    - Your password will be only stored on your computer: this is not really secure,
    so do not use a password similar to your real online accounts!
    You can instead use a dummy password like `password` for example.
    - The email will not really be checked, so you can use a dummy one too
    (it must only finish with `ec-nantes.fr`). This allows you to create
    multiple accounts, to test your code later 😉
    - At the end of the process, the website will ask you to validate your account:
    just ignore it for the moment.
    :::

2. Now, open the admin panel ([http://localhost:8000/admin](http://localhost:8000/admin)),
    and **log in** with the fake **admin account** created by default
    (username: `admin`, password: `admin`)

3. Once connected, **search** in the list `Authentification and authorisation > Users`
    (*or `Authentification et Autorisation > Utilisateurs` in French*)

4. **Search** for your personnal account (the one you created a few minutes ago) and **open** it

5. Scroll down to the ***Permissions*** section, and check the 3 checkboxes:
    * `Active` (*Actif*): this will validate your account
    * `Staff status` (*Statut équipe*): this allows you to connect to the admin panel
        with your personnal account
    * `Superuser status` (*Statut super-utilisateur*): this transforms your personnal
        account into an admin account!

5. Finally, **save** your modifications with the button at the bottom.

6. Now, **log out** from the admin interface, go back to *Nantral Platform*
    ([http://localhost:8000](http://localhost:8000)), and try to **log in** with
    your personal account!

7. Congratulations, you now have a personal admin account on your database 🥳

---

*To go further...*
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
