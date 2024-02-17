---
title: Install Party
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
**only use Powershell**, wich has less issues.

To open a terminal, simply type `Powershell` in the search bar of your system, and open it like any
application. There you are! A new window with some white lines should appear.

:::info
You can also open _PowerShell_ from a right click on the Start Menu, but be
careful to select the _"PowerShell"_ and not _"PowerShell (Admin)"_ !
:::

The directory where you are is shown on the last line. By default, it should be your user directory, so
something like `C:\Users\michel\`. You can deplace to other directories with:

- `cd ".\my_subdirectory\"`: go into the subdirectory `my_subdirectory` (try with the default directory
  `Downloads` !). The `.` in this command represents the current directory. Note that the `"` are optionals
  (they are required only if your path contains spaces).
- `cd ..`: go to the parent directory
- `ls`: list all the files and sub-directories of the current directory

</TabItem>
<TabItem value="mac" label="MacOS">

Open Spotlight, and type `terminal`. Then you can launch the `terminal.app` application, and voilà!
By default, you are in your home directory. You can deplace to other directories with:

- `cd "./my_subdirectory/"`: go into the subdirectory `my_subdirectory`. The `.` in this command represents the
  current directory. Note that the `"` are optionals (they are required only if your path contains spaces).
- `cd ..`: go to the parent directory
- `ls`: list all the files and sub-directories of the current directory

</TabItem>
<TabItem value="lin" label="Linux">

The name of your terminal depends on your distribution. For example, it is "Terminal" for Ubuntu, or "Konsole"
for Kubuntu. Anyway, on most distros you can open it with the keyboard
shotcut <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>T</kbd>.

By default, you are in your home directory. You can change to other directories with:

- `cd "./my_subdirectory/"`: go into the subdirectory `my_subdirectory`. The `.` in this command represents the
  current directory. Note that the `"` are optionals (they are required only if your path contains spaces).
- `cd ..`: go to the parent directory
- `ls`: list all the files and sub-directories of the current directory

</TabItem>
</Tabs>

In general, all the commands have the same syntax:

```bash
program --option1 --option2 arg1 arg2
```

Some explanations:

- `program` is the name of the program you want to use. It could be `python`
  for example, or `cd` (for `Change Directory`), etc...
- `--option` is an option you can pass to the program, which is most of the time
  optional. They always have the `--` at the begingging which indicates it is an option.
  You can also find shortcuts for options, with one dash (for example `-o`).
- `arg` is the main arument you pass to the program. For example, for the `cd`
  program, you pass the name of the directory where you want to go as an argument.
- the space ` ` is used to separate the differents options and arguments of the
  command. So never put a space inside an option or an argument!

**Tip:** all programs have in general the `--help` option to show all the options
and arguments possible, and the `--version` option to check the version.
Remember it, they are very useful! 🤩

</details>

---

import DocCardList from '@theme/DocCardList';

<DocCardList />
