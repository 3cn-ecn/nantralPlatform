---
title: Installing everything
description: "How to install the tools required to contribute to the project"
published: true
date: 2022-05-07T23:08:35.806Z
editor: markdown
dateCreated: 2021-10-12T12:50:21.796Z
---

# Installing everything

## Installing Python

### Installing Python {.tabset}

#### Windows

Download and install Python 3.10 from the [official Python website](https://www.python.org/downloads/).

You can also install Python 3.10 from the [Windows Store](https://www.microsoft.com/fr-fr/p/python-310/9pjpw5ldxlz5?rtc=1#activetab=pivot:overviewtab) althought we do not recommend it.

> Make sure to select `Add Python 3.10 to PATH` when prompted by the installer.![python-install-path.png](/python-install-path.png)
> This will allow you to use the `python` command in the terminal.
> {.is-warning}

#### MacOS

- Download the executable from the [official Python website](https://www.python.org/downloads/) by clicking on the `Download button`.
- Install the file you've just downloaded by clicking on it.

> Make sure to select `Add Python 3.10 to PATH` when prompted by the installer.![python-install-path.png](/python-install-path.png)
> This will allow you to use the `python` command in the terminal.
> {.is-warning}

#### Linux

- Open a terminal and run `sudo apt update && sudo apt install python3 python3-pip -y`. **You will be prompted for your password.**

### Check if everything is working

In order to check that everything is working, open a **new** terminal/command prompt and type `python -v`. You should see something that looks like:

```
PS C:\Users\Charles>python -v
Python 3.10
PS C:\Users\Charles>python
```

If you get an error such as `python is not recognised as a command` something went wrong.

## Installing Node.js and NPM

### Installing Node.js and NPM {.tabset}

#### Windows/MacOS

- Download **Node.js 14.4 LTS** from [the official website](https://nodejs.org/en/).
- Install Node.js by clicking on the executable you just downloaded.
- To make sure that the installation was successful, open a terminal window and run `node -v` then `npm -v`. You should get a version number for each command. If you get an error such as `command not found`, the installation did not work. You can also have to restart your computer to make it work.

#### Linux

- Open a terminal and run `sudo apt update && sudo apt install nodejs npm -y`. **You will be prompted for your password.**

## Installing Visual Studio Code

> You can use whatever IDE suites you the best, however, we strongly encourage you to use Visual Studio Code as we have created a configuration file to make sure everybody follows the same code style. This configuration file only works for VSCode.
> {.is-info}

### Installing the IDE

Download the latest release of VSCode from the [official website](https://code.visualstudio.com/). Click on the executable you've just downloaded and follow the instructions.

If you use Linux, you can also use the snap package: `sudo snap install code --classic`.

### Installing the extensions

VSCode extensions allow you to code more efficiently by providing language support. Here are the one you should install in order to work on Nantral-Platform:

#### Mandatory

- [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) IntelliSense (Pylance), Linting, Debugging (multi-threaded, remote), Jupyter Notebooks, code formatting, refactoring, unit tests, and more.
- [autoDocstring](https://marketplace.visualstudio.com/items?itemName=njpwerner.autodocstring) Generates python docstrings automatically

#### Nice to have

- [Django](https://marketplace.visualstudio.com/items?itemName=batisteo.vscode-django) Beautiful syntax and scoped snippets for perfectionists with deadlines
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) Supercharge Git within VS Code
- [HTML CSS Support](https://marketplace.visualstudio.com/items?itemName=ecmel.vscode-html-css) CSS Intellisense for HTML
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) Code formatter using prettier

## Installing Git

### Installing Git {.tabset}

#### Windows/MacOS

- Download **git** from [the official website](https://git-scm.com/download).
- Install **git** by clicking on the executable you've just downloaded.
- During the installation, just click _OK_ for all the steps, as we don't need to use the advanced options, unless you know what you are doing.
- To make sure that the installation was successful, open a terminal window and run `git -v`. You should get a version number as an output. If you get an error such as `command not found`, the installation did not work. You can also have to restart your computer to make it work.

#### Linux

- Open a terminal and run `sudo apt update && sudo apt install git -y`. **You will be prompted for your password.**

## Installing Github Desktop

If you're not totally fluent whit Git, you can use Github Desktop for easily use git commands with a graphical interface.

### Installing Github Desktop {.tabset}

#### Windows/MacOS

- Download the software on the official website : [desktop.github.com](https://desktop.github.com/)
- Install it and connect it to your Github Account.
- You're done!

#### Linux

- There is no official package of Github Desktop for Linux. You can use the VS code graphical interface instead, or use an unofficial package : follow the instructions [here](https://gist.github.com/berkorbay/6feda478a00b0432d13f1fc0a50467f1)!
