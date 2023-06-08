---
sidebar_position: 1
description: Python is an easy-to-learn language used for the server
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Python

Let's install Python! Python is a very easy-to-learn language, that we
used to serve the website. 

<iframe 
    class="youtube"
    src="https://www.youtube-nocookie.com/embed/x7X9w_GIm1s" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
</iframe>

## The Python language

For Nantral Platform, we need to install the
**Python 3.10** version. Be sure to select the correct version!! ⚠️

<Tabs groupId="os">
<TabItem value="win" label="Windows">

Download and install Python from the **[Windows Store](https://apps.microsoft.com/store/search/python)**.

:::info
You can also download Python from the [official website](https://www.python.org/downloads/). In this case, be careful
to check the **"Add python to the PATH"** option during the installation.
:::

</TabItem>
<TabItem value="mac" label="MacOS">

Download and install Python from the [official website](https://www.python.org/downloads/). Make sure
to check the **"Add python to the PATH"** option during the installation!

:::caution
MacOS has already python installed, but sometimes it is the Python2 version. Unfortunately, it is not compatible with Python3,
so you have to install both versions side by side. If it does not work the first time, you can find tutorials on
Internet to solve it.
:::

</TabItem>
<TabItem value="lin" label="Linux">

Python should be already installed on your system, you can check that you have
the correct version with:
```bash
python3 --version
```

> If Python is not installed, you can run in a terminal:
> ```bash
> sudo apt update && sudo apt install python3 python3-pip -y
> ```
> 
> If you don't have the correct version, install `pyenv`:
> ```bash
> curl https://pyenv.run | bash
> ```
> (`pipenv` will then automatically install the correct version using `pyenv`,
> so don't worry to install the correct python version now.)

</TabItem>
</Tabs>

After the installation, check that it works properly:
* Open a new terminal
* Type this command and press <kbd>ENTER</kbd> to run it:
    ```bash
    python3 --version
    ```
* You should see the Python version on a new line: `Python 3.xx`

<details class="caution">
    <summary>The command does not work or the version is not <em>python3.10</em>, what can I do? 😭</summary>

Sometimes you can have multiple versions of python installed on your system: in this case, using `python` can refer to
another version of python (for instance, it refers by default to python2 if it is installed). 

To avoid this, you can precise which version you want to use by adding the version to the command: try to run 
`python` instead of `python3`, to get the correct version, or `python3.7` for example.

Also notice that on Windows, `python` is sometimes replaced by `py` only: in this case, you can precise the version
by runnning `py -3` for example.

**Once you have found the command that works for you, memorize it: in the following, we will always use `python` or 
`python3` but you might need to replace it by the command which works for you.**

If the command is still not recognized, try to close and reopen your terminal,
or try to reboot your computer to refresh the available commands.

</details>

## Package installer for Python (pip)

Pip should have been installed with Python. To verify this, run:
```bash
python3 -m pip --version
```
It should produce a line like this: `pip 20.0.2 from /usr/lib/python3/dist-packages/pip (python 3.10)`

<details>
<summary>I have the error <em>"command pip not found"</em>, what can I do?</summary>

First, pip is maybe not installed on your system. To install it, run
```bash
python3 -m ensurepip --upgrade
```
or on Linux:
```
sudo apt-get install python3-pip
```

:::note
Don't forget to replace `python` by `python3` or `py` if needed, as we have seen previsouly.
:::

</details>

If you are a more advanced user, you can also add `pip` to your PATH to run
directly `pip3` instead of `python3 -m pip`. In most cases it will be already
added to your PATH!

## Pipenv

Finally, we will install `pipenv` to replace `pip`. *But why did you ask me to
intall `pip` so?*, you will ask me! Well, the answer is pretty simple: we need
`pip` to install `pipenv`.

<Tabs groupId="os">
<TabItem value="win" label="Windows">

1. First, run this command into **PowerShell** to install `pipenv`:
    ```powershell
    python3 -m pip install --user pipenv
    ```
2. Add the `pipenv` command to your PATH:
    ```powershell
    [Environment]::SetEnvironmentVariable("PATH", $Env:PATH + ";$($(get-item $(python -m site --user-site)).parent.FullName)\Scripts", [EnvironmentVariableTarget]::User)
    ```
4. Close and reopen your terminal to refresh the PATH.
5. Finally let's test the installation:
    ```bash
    pipenv --version
    ```

</TabItem>
<TabItem value="mac-lin" label="MacOS/Linux">

1. First, run this command to install `pipenv`:
    ```bash
    python3 -m pip install --user pipenv
    ```
2. Test the installation:
    ```bash
    pipenv --version
    ````
3. If it does not work, you might need to add `pipenv` to your PATH. To do this,
    you will edit your profile configuration file `~/.bashrc`, or `~/.zshrc`.
    At the end of the file, add this line:
    ```bash
    export PATH="$PATH:$(python3 -m site --user-base)/bin"
    ```
    Close and restart your terminal, and test again to run `pipenv`.
    If it still doesn't work, replace the previous line by this one:
    ```bash
    export PATH="$PATH:$(python3 -m site --user-site)"
    ```

</TabItem>
</Tabs>

That's it! You finished to install python, congratulations 🥳
