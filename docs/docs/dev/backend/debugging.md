---
sidebar_position: 8
---

# Debugging

Welcome to the hell of all programmers! Don't worry, we will help you to get out
of your bug.

:::tip The Debugging Guide
If you didn't read this guide before, well, you **MUST** begin with it. It will
save you a lot of time!

👉 **[The Debugging Guide: 20 simple steps to debug anything](https://debug.guide/)** 👈
:::

## Common issues on the backend

Here is a list of common problems you should check if you encounter a problem.

### Check-list

- Did you launch the backend with `pipenv run start` ?
- Did you install the latest dependencies with `pipenv install`?
- Did you apply the latest migrations with `pipenv run migrate`?
- Is the server running?

### If you're still stuck

- Reset the dependencies:
  - remove the `.venv` folder and all of its content
  - run `pipenv install`
- Reset the database:
  - Rename your database file (for example `db.sqlite3` to `db.old.sqlite3`)
  - Run `pipenv run migrate` to create a new database
  - Run `pipenv run django createsuperuser` to create a new admin user
  - Follow [this guide](/dev/get-started/setup-project/#start-the-server) to recreate your account

## Common issues on the frontend

Here is a list of common problems you should check if you encounter a problem.

### Check-list

- Did you launch the frontend with `npm run start` ?
- Did you install the latest dependencies with `npm install`?
- Is the server running?

### If you're still stuck

- Reset the _vite_ builder:
  - remove the `.vite` folder (sometimes in `node_modules`) and all of its content
  - run `npm run start` to make a clean build
- Reset the dependencies:
  - remove the `node_modules` folder and all of its content
  - run `npm ci` to make a clean Install

## Other issues

Local issues can be hard to track down. Don't hesitate to:

- **Ask Google/StackOverflow**: you will likely find an answer there.
  Be sure to make your search in English to get more results.
- **Ask an IA like _ChatGPT_**: if you give enough context, it can
  be very useful and save you a lot of time!
- **Ask a human**: if you are stuck, you can ask for help on the Discord server
  in the _`#je-galère-avec-un-truc`_ channel.
  Be sure to give enough context to your issue, and explain what you have
  already tried.
  You can also ask a teacher.
