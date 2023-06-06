---
last_update:
  date: 2023-02-07 14:58:56 +0100
  author: Alexis Delage
sidebar_position: 4
---

# Last things to know

Some important things to know before starting to code.

## Updates

When someone else make changes on the project, you have to update your database
on your computer to avoid problems.
* First, download the last commits on your local branch: 
    ```bash
    git pull
    ```
* Then, update the dependencies and your database:
    ```bash
    make update
    ```

## Run the back end server (Django)

To run the backend, simply go into the `backend` folder and start the server:
```bash
cd backend/
pipenv run start
```

The server will be launched on the background, and you can then access
the website at [http://localhost:8000](http://localhost:8000). You can stop the
server at any time by simply pressing <kbd>CTRL</kbd>+<kbd>C</kbd> in the terminal.

When you edit a file of the backend, the changes will be automatically
taken into account: no need to relaunch the server.

## Run the front end server (React)

If you also want to code on the front end, open a second terminal
(you need to keep the django server running), and run these commands:
```bash
cd frontend/
npm run start
```

You can now visit your browser at [http://localhost:8000](http://localhost:8000) to see
the result! 🥳

:::caution 
When you modify the frontend files, they will be updated in the django files, but they will not be updated
in your browser: the cause of this fact is that django caches the javascript files, and so do not use
the last version of the frontend.

To correct this, you have to empty the cache of your browser: to do it, simply refresh your page
in your browser by pressing <kbd>CTRL</kbd>+<kbd>F5</kbd>.
:::