---
sidebar_position: 4
---

# Begin to code

## The back end

For the backend, simply go into the `backend` folder and run this command:
```bash
cd backend/
pipenv run start
```

The server will be launched on the background, and you can then access
the website at [http://localhost:8000](http://localhost:8000). You can stop the
server at any time by simply pressing <kbd>CTRL</kbd>+<kbd>C</kbd> in the terminal.

When you edit a file of the backend, the changes will be automatically
taken into account: no need to relaunch the server.

## The front end

For the front end, open a new terminal in the `frontend` folder and run this command:
```bash
cd frontend/
npm run start
```

This will generate files in a `.js` format, which will be created in the `backend/static/js` directory.
When you modify and save a source file of the frontend, the compilation will be automatic and the build files
will be instantly updated.

:::info
If you need to compile the files without listening to modifications, you can also run
```bash
npm run build:dev
```
:::

Now, ensure that Django is running in your first terminal, and visit your browser at [http://localhost:8000](http://localhost:8000) to see
the result! 🥳

:::caution 
When you modify the frontend files, they will be updated in the django files, but they will not be updated
in your browser: the cause of this fact is that django caches the javascript files, and so do not use
the last version of the frontend.

To correct this, you have to empty the cache of your browser: to do it, simply refresh your page
in your browser by pressing <kbd>CTRL</kbd>+<kbd>F5</kbd>.
:::