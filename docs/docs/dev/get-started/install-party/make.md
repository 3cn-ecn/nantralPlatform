---
last_update:
  date: 2023-02-07 14:58:56 +0100
  author: Alexis Delage
sidebar_position: 3
description: Make everything with Make!
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Make

Now it's time to install `make`! It is a small command-line tool which will be very
helpful in the following, trust me ;)

<Tabs groupId="os">
<TabItem value="win" label="Windows">

1. Open **Powershell** and run:
    ```powershell
    winget install GnuWin32.make
    ```
    If the `winget` command does not work, install it from the [Windows Store](https://www.microsoft.com/p/app-installer/9nblggh4nns1#activetab=pivot:overviewtab).
2. Add `make` to your PATH:
    ```powershell
    [Environment]::SetEnvironmentVariable("PATH", $Env:PATH + ";C:\Program Files (x86)\GnuWin32\bin\", [EnvironmentVariableTarget]::User)
    ```
3. Close and restart your terminal, then test the command:
    ```powershell
    make --version
    ```

<details>
<summary>In case it doesn't work... 😓</summary>

Try to install `make` by folloing this tutorial:
[technewstoday.com/install-and-use-make-in-windows](https://www.technewstoday.com/install-and-use-make-in-windows/).

</details>
</TabItem>
<TabItem value="mac-lin" label="MacOS/Linux">

Make is already installed on your system! You have nothing to do 😁

Try it with:
```bash
make --version
```

</TabItem>
</Tabs>
