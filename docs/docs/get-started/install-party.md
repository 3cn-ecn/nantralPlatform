---
title: Install party
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Install Party

Let's start by installing all the programs we need!

To do this, we will need to use the terminal: make sure that you know how to open it and use it.

<details>
<summary>Help! I don't know what a terminal is 😢</summary>
Don't worry, we will explain you the basics 😉
<Tabs groupId="os">
<TabItem value="win" label="Windows">

On Windows, you have two terminals: `CMD`, the oldest one, and `Powershell`, the new one. We recommend you to
use Powershell.

To open a terminal, simply type `Powershell` or `CMD` in the search bar of your system, and open it like any 
application. There you are! A new window with some white lines should appear.

The directory where you are is shown on the last line. By default, it should be your user directory, so 
something like `C:\Users\michel\`. You can deplace to other directories with:
* `cd ".\my_subdirectory\"`: go into the subdirectory `my_subdirectory` (try with the default directory 
    `Downloads` !). The `.` in this command represents the current directory. Note that the `"` are optionals
    (they are required only if your path contains spaces).
* `cd ..`: go to the parent directory
* `ls`: list all the files and sub-directories of the current directory

</TabItem>
<TabItem value="mac" label="MacOS">

Open Spotlight, and type `terminal`. Then you can launch the `terminal.app` application, and voilà!
By default, you are in your home directory. You can deplace to other directories with:
* `cd "./my_subdirectory/"`: go into the subdirectory `my_subdirectory`. The `.` in this command represents the 
    current directory. Note that the `"` are optionals (they are required only if your path contains spaces).
* `cd ..`: go to the parent directory
* `ls`: list all the files and sub-directories of the current directory

</TabItem>
<TabItem value="lin" label="Linux">

The name of your terminal depends on your distribution. For example, it is "Terminal" for Ubuntu, or "Konsole" 
for Kubuntu.
By default, you are in your home directory. You can deplace to other directories with:
* `cd "./my_subdirectory/"`: go into the subdirectory `my_subdirectory`. The `.` in this command represents the 
    current directory. Note that the `"` are optionals (they are required only if your path contains spaces).
* `cd ..`: go to the parent directory
* `ls`: list all the files and sub-directories of the current directory

</TabItem>
</Tabs>
</details>

## Python

Python is the program corresponding to the famous language. We recommend to use Python `3.10` since it is the latest 
stable version, but you can use other versions (minimum `3.7`).

<Tabs groupId="os">
<TabItem value="win" label="Windows">

Download and install Python from the [Windows Store](https://www.microsoft.com/store/productId/9PJPW5LDXLZ5).

:::info
You can also download Python from the [official website](https://www.python.org/downloads/). In this case, be careful
to check the **"Add python to the PATH"** option during the installation.
:::

</TabItem>
<TabItem value="mac" label="MacOS">

Download and install Python from the [official website](https://www.python.org/downloads/). Make sure
to check the **"Add python to the PATH"** option during the installation!

:::caution
MacOS has already python installed, but the Python 2 version. Unfortunately, it is not compatible with Python 3,
so you have to install both versions side by side. If it does not work the first time, you can find tutorials on
Internet to solve it.
:::

</TabItem>
<TabItem value="lin" label="Linux">

Open a terminal and run `sudo apt update && sudo apt install python3 python3-pip -y`.

:::caution
Some Linux distributions come with `Python` already installed. In this case, try to check your python version: 
if your version is bellowed `3.7`, you might need to upgrade your distribution.
::: 

</TabItem>
</Tabs>

After the installation, check that it works properly:
* Open a new terminal
* Type the command `python --version` and press <kbd>ENTER</kbd> to run it.
* You should see the Python version on a new line: `Python 3.10`
* If you get an error, or if the version is incorrect, try to replace `python` by `python3`, `py`, or `py3`. Remember
    it: you will need to replace it every time in the following.

<details>
    <summary>Discover Python in 100s</summary>
    <iframe 
        class="youtube"
        src="https://www.youtube-nocookie.com/embed/x7X9w_GIm1s" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
    </iframe>
</details>

## Node.js

We recommend you to use the latest stable version of Node (also called the "LTS" version). Currently, it is the
16.15.0 version.

<Tabs groupId="os">
<TabItem value="win" label="Windows">

- Download **Node.js LTS** from [the official website](https://nodejs.org/en/).
- Install Node.js by clicking on the executable you just downloaded.

</TabItem>
<TabItem value="mac" label="MacOS">

- Download **Node.js LTS** from [the official website](https://nodejs.org/en/).
- Install Node.js by clicking on the executable you just downloaded.

</TabItem>
<TabItem value="lin" label="Linux">

- Open a terminal and run `sudo apt update && sudo apt install nodejs npm -y`.

:::info
You might need in the future to have different versions of node.js installed for different projects. To manage them,
you can check the `nvm` package which allowed you to have multiple versions of node.js.
:::

</TabItem>
</Tabs>

Check that the installtion was successful: 
- Open a terminal and run `node -v`, then `npm -v`. 
- You should get a version number for each command. If you get an error such as `command not found`, the 
    installation did not work. You can also have to restart your computer to make it work.

As you saw, node.js comes with two different commands:
* `node` is the programming language itself, which allow us to run scripts in javascript
* `npm` is the **n**ode **p**ackage **m**anager, which we will use to install dependencies

<details>
    <summary>Discover Nodejs in 15min</summary>
    <iframe 
        class="youtube"
        src="https://www.youtube-nocookie.com/embed/ENrzD9HAZK4" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
    </iframe>
</details>

## Visual Studio Code

You can use whatever IDE suites you the best, however, we strongly encourage you to use Visual Studio Code as we have 
created vscode configuration files to make sure everybody follow the same code style.

<Tabs groupId="os">
<TabItem value="win" label="Windows">

* Download the latest release of VSCode from the [official website](https://code.visualstudio.com/). 
* Click on the executable you've just downloaded and follow the instructions.

</TabItem>
<TabItem value="mac" label="MacOS">

* Download the latest release of VSCode from the [official website](https://code.visualstudio.com/). 
* Click on the executable you've just downloaded and follow the instructions.

</TabItem>
<TabItem value="lin" label="Linux">

Install the snap package: `sudo snap install code --classic`.

:::info
If you prefere, Visual Studio Code is also available as a flatpak package.
:::

</TabItem>
</Tabs>

<details>
    <summary>Discover VS Code in 100s</summary>
    <iframe 
        class="youtube"
        src="https://www.youtube-nocookie.com/embed/KMxo3T_MTvY" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
    </iframe>
</details>

## Git

<Tabs groupId="os">
<TabItem value="win" label="Windows">

- Download `git` from [the official website](https://git-scm.com/download).
- Install `git` by clicking on the executable you've just downloaded.
- During the installation, just click `OK` for all the steps as we don't need to use the advanced options, 
    unless you know what you are doing.

</TabItem>
<TabItem value="mac" label="MacOS">

- Download `git` from [the official website](https://git-scm.com/download).
- Install `git` by clicking on the executable you've just downloaded.
- During the installation, just click `OK` for all the steps as we don't need to use the advanced options, 
    unless you know what you are doing.

</TabItem>
<TabItem value="lin" label="Linux">

Open a terminal and run `sudo apt update && sudo apt install git -y`.

</TabItem>
</Tabs>

To make sure that the installation was successful, open a terminal window and run `git -v`. 
You should get a version number as an output. If you get an error such as `command not found`, 
the installation did not work. You can also have to restart your computer to make it work.

<details>
    <summary>Discover Git in 100s</summary>
    <iframe 
        class="youtube"
        src="https://www.youtube-nocookie.com/embed/hwP7WQkmECE" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
    </iframe>
</details>

## Github Desktop

If you're not totally fluent whit the Git command-line interface, you can use Github Desktop for easily use git 
commands with a graphical interface.

<Tabs groupId="os">
<TabItem value="win" label="Windows">

- Download the software on the official website : [desktop.github.com](https://desktop.github.com/)
- Install it and connect it to your Github Account.
- You're done!

</TabItem>
<TabItem value="mac" label="MacOS">

- Download the software on the official website : [desktop.github.com](https://desktop.github.com/)
- Install it and connect it to your Github Account.
- You're done!

</TabItem>
<TabItem value="lin" label="Linux">

Sorry, there is no official package of Github Desktop for Linux. 😢 

You can use the other options bellow instead, or use the unofficial package for linux 
([follow the instructions here](https://gist.github.com/berkorbay/6feda478a00b0432d13f1fc0a50467f1)).

</TabItem>
</Tabs>

:::info Other Git Interfaces
If you already know git, you can also use the git manager in VS Code. However we strongly recommend to enrich it
by installing the [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) extension!
:::

## Congratulations 🥳

You installed all the programs! Now let's try some exercices and tutorials so as to learn the different concepts
of the Nantral Platform project.