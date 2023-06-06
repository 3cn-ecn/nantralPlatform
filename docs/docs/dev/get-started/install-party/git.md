---
last_update:
  date: 2023-02-07 14:58:56 +0100
  author: Alexis Delage
sidebar_position: 5
description: Once you started to use it, you can't live without it anymore
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Git

<iframe 
    class="youtube"
    src="https://www.youtube-nocookie.com/embed/hwP7WQkmECE" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
</iframe>

## The Git program

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

:::note Create a github Account
If you don't have a Github account yet, it's time to create one! Go to [github.com](https://github.com/),
anc click **Sign up**. Then follow the instructions to create your account.
:::

## Github Desktop

If you're not totally fluent whit the Git command-line interface, you can also
download Github Desktop to easily use git commands with a graphical interface.

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

You installed all the programs! Congratulations!
