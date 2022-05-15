---
title: Setup your dev tools
sidebar_position: 3
---

# Setup your dev tools

_Things to do the first time you want to develop!_

## 1. Cloning the repository

### 1. Cloning the repository {.tabset}

#### Using Github Desktop

1. Start Github Desktop
2. Select "Clone a repository from the internet" (if you don't see the button, select File > Clone repository)
3. Paste the repository url: `https://github.com/nantral-platform/nantralPlatform.git`, or only `nantral-platform/nantralPlatform` and clone the repository!
4. Wait during the download, and then click the "Open in Visual Studio Code" button

#### Using VSCode

1. Start by opening VSCode.
2. Once your folder is opened, press <kbd>CTRL</kbd> + <kbd>SHIFT</kbd> + <kbd>P</kbd> (for Mac users: <kbd>CMD</kbd> + <kbd>SHIFT</kbd> + <kbd>P</kbd>), then type `Clone` and press <kbd>ENTER</kbd>.
3. In the prompt window, paste `https://github.com/nantral-platform/nantralPlatform.git`.
4. When prompted, select a folder where you want to clone the repository. This will create a folder named `nantralPlatform` where everything will be stored.
5. Open the `nantralPlatform` folder in VSCode once the repository has ben cloned.

> A detailed tutorial with screenshots is available [here](https://code.visualstudio.com/docs/editor/versioncontrol#_cloning-a-repository).
> {.is-info}

## 2. Discover the project structure

### Description

In VSCode, in the left panel, you can see the folder structure of the repository. Here are a few explanations about the purpose of the main folders.

```js
📁.github  //Contains the definitions for github actions
📁frontend //Contains source files to be compiled for the frontend
📁backend  //Contains source files for the backend
    📁static //Contains static files to be served by the server
```

### Frontend

The frontend is an NPM application which uses React.js.
Source files are compiled using Babel and Webpack and the output is stored in `server/static/js`.

### Backend

The backend is a django application. The main files are organised like this:

```js
📁apps //Contains all the applications
📁config //General config folder
    📁settings
        📄base.py //Base settings
        📄dev-local.py //Settings for local dev
        📄production.py //Settings for production
    📄asgi.py
    📄urls.py //General url config
    📄wsgi.py
📁templates //Genral template folder
📄manage.py //General script to launch and make migrations
📄requirements.txt //Contains python requirements
```