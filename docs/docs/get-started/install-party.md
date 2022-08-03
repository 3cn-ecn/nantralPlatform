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
always use **Powershell**, wich has less issues.

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
for Kubuntu. Anyway, on most distros you can open it with the keyboard 
shotcut <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>T</kbd>.

By default, you are in your home directory. You can change to other directories with:
* `cd "./my_subdirectory/"`: go into the subdirectory `my_subdirectory`. The `.` in this command represents the 
    current directory. Note that the `"` are optionals (they are required only if your path contains spaces).
* `cd ..`: go to the parent directory
* `ls`: list all the files and sub-directories of the current directory

</TabItem>
</Tabs>

In general, all the commands have the same syntax:
```bash
program --option1 --option2 arg1 arg2
```
Some explanations:
* `program` is the name of the program you want to use. It could be `python`
    for example, or `cd` (for `Change Directory`), etc...
* `--option` is an option you can pass to the program, which is most of the time
    optional. They always have the `--` at the begingging which indicates it is an option.
    You can also find shortcuts for options, with one dash (for example `-o`).
* `arg` is the main arument you pass to the program. For example, for the `cd`
    program, you pass the name of the directory where you want to go as an argument.
* the space ` ` is used to separate the differents options and arguments of the 
    command. So never put a space inside an option or an argument!

**Tip:** all programs have in general the `--help` option to show all the options
    and arguments possible, and the `--version` option to check the version.
    Remember it, they are very useful! 🤩

</details>

## Python

First let's install Python. Nantral Platform runs on **Python 3.10**, but you
can use another version if you prefere, just be sure to use at least **Python3**.

<Tabs groupId="os">
<TabItem value="win" label="Windows">

Download and installf Python from the [Windows Store](https://www.microsoft.com/store/productId/9PJPW5LDXLZ5).

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

Open a terminal and run
```bash
sudo apt update && sudo apt install python3 python3-pip -y
```

</TabItem>
</Tabs>

After the installation, check that it works properly:
* Open a new terminal
* Type this command and press <kbd>ENTER</kbd> to run it:
    ```bash
    python --version
    ```
* You should see the Python version on a new line: `Python 3.10`

<details class="caution">
    <summary>The command does not work or the version is lower than <em>python3</em>, what can I do? 😭</summary>

Sometimes you can have multiple versions of python installed on your system: in this case, using `python` can refer to
another version of python (for instance, it refers by default to python2 if it is installed). 

To avoid this, you can precise which version you want to use by adding the version to the command: try to run 
`python3 --version` or `python3.10 --version` for example, to get the correct version.

Also notice that on Windows, `python` is sometimes replaced by `py` only: in this case, you can precise the version
by runnning `py -3` for example.

**Once you have found the command that works for you, memorize it: in the following, we will always use `python` or 
`python3` but you might need to replace it by the command which works for you.**

If the command is still not recognized, try to close and reopen your terminal,
or try to reboot your computer to refresh the available commands.

</details>

### Pip

Pip should have been installed with Python. To verify this, run:
```bash
pip --version
```
It should produce a line like this: `pip 20.0.2 from /usr/lib/python3/dist-packages/pip (python 3.10)`

**Check the python version at the end of the line!**
If it is lower than `python3`, try to run `pip3` instead of `pip`.

<details>
<summary>I have the error <em>"command pip not found"</em>, what can I do?</summary>

First, pip is maybe not installed on your system. To install it, run
```bash
python -m ensurepip --upgrade
```bash
Then, you should get pip through this command:
```bash
python -m pip --version
```

:::note
Don't forget to replace `python` by `python3` or `py` if needed, as we have seen previsouly.
:::

Finally, try to launch the pip command directly: 
```bash
pip --version
```

If this last command does not work, that means that pip is not installed in your PATH.
Try to close and reopen your terminal, or reboot your computer if you still don't get
`pip`.
If the error persists, add `pip` to your PATH manually (check the internet!),
or replace `pip` by `python -m pip` if it does not bother you.

</details>

### Pipenv

Finally, we will install `pipenv` to replace `pip`. *But why did you ask to
intall `pip` so?*, you will ask me! Well, the answer is pretty simple: we need
`pip` to install `pipenv`.

Run this command to install `pipenv`:
```bash
pip install --user pipenv
```

Then add the `pipenv` command to your PATH:

<Tabs groupId="os">
<TabItem value="win" label="Windows">

1. Run this command to get the path of the directory to add:
    ```bash
    python -m site --user-site
    ```
    A sample output could be: ` C:\Users\jetbrains\AppData\Roaming\Python\Python37\site-packages`
2. Replace `site-packages` with `Scripts` in the output and add it to the PATH variable, for example:
    ```bash
    setx PATH "%PATH%;C:\Users\jetbrains\AppData\Roaming\Python\Python37\Scripts"
    ```
3. You could need to close and reopen your terminal after.

</TabItem>
<TabItem value="mac-lin" label="MacOS/Linux">

1. Run the following command to find the user base's binary directory:
    ```bash
    python -m site --user-base
    ```
    An example of output can be: `/home/jetbrains/.local`
2. Add **bin** to this path and run this command to add it to your PATH:
    ```bash
    export PATH="$PATH:/home/jetbrains/.local/bin"
    ```
3. Refresh the PATH in your terminal:
    ```bash
    source ~/.bashrc
    ```

</TabItem>
</Tabs>

Now you can test if `pipenv` works for you:
```bash
pipenv --version
```
*You could get some warnings, but if the last line show the name **pipenv** with
a number version, it's all good!*

That's it! You finished to install python, congratulations 🥳

<details>
    <summary>Discover Python in 100s 🎬</summary>
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
<TabItem value="win-mac" label="Windows/MacOS">

- Download **Node.js LTS** from [the official website](https://nodejs.org/en/).
- Install Node.js by clicking on the executable you just downloaded.

</TabItem>
<TabItem value="lin" label="Linux">

Open a terminal and run
```bash
sudo apt update && sudo apt install nodejs npm -y
```

:::info
You might need in the future to have different versions of node.js installed for different projects. To manage them,
you can check the `nvm` package which allowed you to have multiple versions of node.js.
:::

</TabItem>
</Tabs>

Check that the installtion was successful: 
- Open a terminal and run `node -v`, and then `npm -v`. 
- You should get a version number for each command. If you get an error such as `command not found`, the 
    installation did not work. You can also have to restart your computer to make it work.

As you saw, node.js comes with two different commands:
* `node` is the programming language itself, which allow us to run scripts in javascript
* `npm` is the **n**ode **p**ackage **m**anager, which we will use to install dependencies

<details>
    <summary>Discover Nodejs in 15min 🎬</summary>
    <iframe 
        class="youtube"
        src="https://www.youtube-nocookie.com/embed/ENrzD9HAZK4" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
    </iframe>
</details>

## Make

It's time to install `make`! 

<Tabs groupId="os">
<TabItem value="win" label="Windows">

1. Open Powershell and run:
    ```bash
    winget install gnuwin32.make
    ```
2. Add `make` to your PATH:
    ```bash
    setx PATH "%PATH%;C:\Program Files(x86)\GnuWin32\bin\make.exe"
    ```
3. Relaunch your terminal (or computer if needed) and try to run `make`:
    ```bash
    make --version
    ```

</TabItem>
<TabItem value="mac-lin" label="MacOS/Linux">

Make is already installed on your system! You have nothing to do 😁

Try it with:
```bash
make --version
```

</TabItem>
</Tabs>

## Visual Studio Code

You can use whatever IDE suites you the best, however, we strongly encourage you to use Visual Studio Code as we have 
created vscode configuration files to make sure everybody follow the same code style.

<Tabs groupId="os">
<TabItem value="win-mac" label="Windows/MacOS">

* Download the latest release of VSCode from the [official website](https://code.visualstudio.com/). 
* Click on the executable you've just downloaded and follow the instructions.

</TabItem>
<TabItem value="lin" label="Linux">

Install the snap package:
```bash
sudo snap install code --classic
```

:::info
If you prefere, Visual Studio Code is also available as a 
[flatpak package](https://flathub.org/apps/details/com.visualstudio.code), 
or as a `.deb` package on the [official website](https://code.visualstudio.com/download).
:::

</TabItem>
</Tabs>

<details>
    <summary>Discover VS Code in 100s 🎬</summary>
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
<TabItem value="win-mac" label="Windows/MacOS">

- Download `git` from [the official website](https://git-scm.com/download).
- Install `git` by clicking on the executable you've just downloaded.
- During the installation, just click `OK` for all the steps as we don't need to use the advanced options, 
    unless you know what you are doing.

</TabItem>
<TabItem value="lin" label="Linux">

Open a terminal and run:
```bash
sudo apt update && sudo apt install git -y
```

</TabItem>
</Tabs>

To make sure that the installation was successful, open a terminal window and run `git -v`. 
You should get a version number as an output. If you get an error such as `command not found`, 
the installation did not work. You can also have to restart your computer to make it work.

<details>
    <summary>Discover Git in 100s 🎬</summary>
    <iframe 
        class="youtube"
        src="https://www.youtube-nocookie.com/embed/hwP7WQkmECE" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
    </iframe>
</details>

:::note Create a github Account
If you don't have a Github account yet, it's time to create one! Go to [github.com](https://github.com/),
anc click **Sign up**. Then follow the instructions to create your account.
:::

## Github Desktop

If you're not totally fluent whit the Git command-line interface, you can use Github Desktop for easily use git 
commands with a graphical interface.

<Tabs groupId="os">
<TabItem value="win-mac" label="Windows/MacOS">

- Download the software on the official website : [desktop.github.com](https://desktop.github.com/)
- Install it and connect it to your Github Account.
- You're done!

</TabItem>
<TabItem value="lin" label="Linux">

Sorry, there is no official package of Github Desktop for Linux. 😢 
You can use the other options below instead, or use the unofficial package for linux 
([follow the instructions here](https://gist.github.com/berkorbay/6feda478a00b0432d13f1fc0a50467f1)).

</TabItem>
</Tabs>

:::success Other Git Interfaces
If you already know git, you can also use the git manager in VS Code. However we strongly recommend to enrich it
by installing the [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) extension!
:::

## Congratulations 🥳

You installed all the programs! Now let's try some exercices and tutorials so as to learn the different concepts
of the Nantral Platform project.
