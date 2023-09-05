---
sidebar_position: 4
---

# Last things to know

Some important things to know before starting to code.

## Updates

When someone else make changes on the project, you have to update your database
on your computer to avoid problems.

- First, download the last commits on your local branch:
  ```bash
  git pull
  ```
- Then, update the dependencies and your database:
  ```bash
  make update
  ```

## Run the back end server (Django)

To run the backend, simply go into the `backend` folder and start the server:

```bash
cd backend/
pipenv run start
```

The server will be launched in the background. You can stop the
server at any time by simply pressing <kbd>CTRL</kbd>+<kbd>C</kbd> in the terminal.

When you edit a file of the backend, the changes will be automatically
taken into account: no need to relaunch the server.

## Run the front end server (React)

To run the front end, open a second terminal
(you need to keep the django server running), and run these commands:

```bash
cd frontend/
npm run start
```

You can now visit your browser at [http://localhost:8000](http://localhost:8000) to see
the result! 🥳

:::caution
When you modify the frontend files, they might not be updated in your browser.
You have to refresh the tab, with the `Refresh` button
or <kbd>Ctrl</kbd>+<kbd>R</kbd> (<kbd>cmd ⌘</kbd>+<kbd>R</kbd> on MacOS).
:::
