---
title: Set up React
sidebar_position: 4
---

# Set up React

After the backend, let's set up the frontend! In comparison to django, you will see that that setting up
the frontend is rather easy 😉

## Install dependencies

1. Open a new terminal in VScode, next to the terminal for django
2. In this terminal, go to the `frontend` directory:
    ```bash
    cd frontend
    ```
3. Then install the dependencies (it could take several minutes)
    ```bash
    npm install
    ```

That's it, your environment is ready! 

:::info 
Note that on contrary to django, we do not need to create a virtual environment for node.
By default, the dependencies are installed in the `node_modules` directory in the frontend.

To put it in a nutshell, you can say that node already uses virtual environments by default 😁
:::

## Compile the frontend

To compile the source files, run
```bash
npm run watch
```

This will generate files in a `.js` format, which will be created in the `backend/static/js` directory.
When you modify and save a source file of the frontend, the compilation will be automatic and the build files
will be instantly updated.

:::note
If you need to compile the files without listening to modifications, you can also run
```bash
npm run dev
```
:::

## See the result!

Now, ensure that Django is running in your first terminal (if not, run `python3 manage.py runserver`
in the `backend` folder), and visit your browser at [http://localhost:8000](http://localhost:8000) to see
the result! 🥳

:::caution 
When you modify the frontend files, they will be updated in the django files, but they will not be updated
in your browser: the cause of this fact is that django caches the javascript files, and so do not use
the last version of the frontend.

To correct this, you have to empty the cache of your browser: to do it, simply refresh your page
in your browser by pressing <kbd>CTRL</kbd>+<kbd>F5</kbd>.
:::