---
title: How to use Python Virtualenv
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# How to use Python Virtualenv

A virtualenv allow you to have certain requirements versions for a project which
are differents from the ones you have on your computer.

## a) Install the virtualenv package

First, you have to install the virtualenv package so as to enable the
functionnality. It should already be done in the install party, but we remind it
here the command line just in case:

```bash
python3 -m pip install virtualenv
```

## b) Create a virtualenv

Then you can create a virtualenv in a folder by running this simple command
line. By default, we will use in this example the name `env` as the name
of your virtualenv, but you can replace it by any name you want.
```bash
python3 -m virtualenv env
```

For the Nantral Platform project, you have to create a virtulenv in the
`backend` directory since it is where we use Python code.

## c) Activate a virtualenv

You need to activate your virtualenv before doing anything using Python about
the project. Once the virtualenv is activated, you will notice the `(env)` at
the far left of the command prompt.

:::caution Check your terminal
The command to run depends of your terminal: if you use Windows, please be sure
of what terminal you use (CMD or Powershell).
:::

<Tabs>
<TabItem value="mac-lin" label="MacOS/Linux">

Go to the folder which contains your virtualenv (in our case the `backend`
folder), and run:
```bash
source env/bin/activate
```

</TabItem>
<TabItem value="win-cmd" label="Windows (CMD)">

Go to the folder which contains your virtualenv (in our case the `backend`
folder), and run:
```bash
env\Scripts\activate.bat
```

</TabItem>
<TabItem value="win-ps1" label="Windows (Powershell)">

Go to the folder which contains your virtualenv (in our case the `backend`
folder), and run:
```bash
env\Scripts\activate.ps1
```

<details>
<summary>Help, I have an error! 😢</summary>

If you have an error, please run this command and try again:
```bash
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser
```

</details>
</TabItem>
</Tabs>

## d) Close the virtualenv

To close the virtualenv, simply run this command anywhere (you don't need to be
in the same folder as your virtualenv):
```
deactivate
```

## Alternative: virtualenvwrapper

Alternatively, you can use `virtualenvwrapper` to easily manage several
virtualenv. Follow the [instructions here](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/development_environment#using_django_inside_a_python_virtual_environment)
to install it. Once installed, you can use:

- `mkvirtualenv env_name` to create a virtual env
- `workon env_name` to activate a virtual env (it doesn't depends on the current folder you're in)
- `deactivate` to close the virtual env

Since the installation is a little more tricky, we do NOT recommand this for 
beginners; however, if you succeed to install it before (for example while doing
the MDN tutorial), you can use it if you prefere.
