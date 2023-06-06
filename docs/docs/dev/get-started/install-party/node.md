---
last_update:
  date: 2023-02-07 14:58:56 +0100
  author: Alexis Delage
sidebar_position: 2
description: JavaScript, the language of the web
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Node.js

<iframe 
    class="youtube"
    src="https://www.youtube-nocookie.com/embed/ENrzD9HAZK4" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
</iframe>

---
We recommend you to use the **LaTest Stable** version of **Node** (also called the "LTS" version). Currently, it is the
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
