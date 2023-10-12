---
sidebar_position: 0
---

# Pick an OS

First of all, you need to pick an OS. You can use any OS, but they all have
their pros and cons.

## Summary

| My situation                                           | The choice we recommend                                |
| ------------------------------------------------------ | ------------------------------------------------------ |
| I have a Mac                                           | Use MacOS                                              |
| I already know Linux or I am interested in learning it | Use Linux                                              |
| I have a Windows with good performances                | Use WSL                                                |
| I have a Windows with very bad performances            | Use Windows (or Linux if you want better performances) |

## Pros and cons of each OS

### Windows

✅ Pros: you already know how to use it and are familiar with the interface.

❌ Cons: you will have more bugs and problems during development, because
Windows is not meant for web development (it is not a Unix-based system).

### MacOS

✅ Pros: easy to use and perfect for web development, since it is a Unix-based
system.

❌ Cons: it is expensive and you need to buy a Mac. You will also have less
compatibility with other devices.

### Linux

✅ Pros: it is perfect for web development, as a Unix-based system.
It is also free, installable on any computer, you can dual-boot it with Windows,
and has a lot more tools for devs than Windows or MacOS.

❌ Cons: you will need to learn how to use it, and it is not as user-friendly
as Windows or MacOS.

<details>
<summary>Instructions for Linux...</summary>

You'll need to pick a distribution to start with. If you are a beginner,
we recommend you to use an _Ubuntu_-based distribution: they have great
interfaces, are rather easy to user, and have a lot of documentation online.

Some of the best _Ubuntu_-based distributions:

- [Linux Mint](https://linuxmint.com/): the most reliable
- [Pop!\_OS](https://pop.system76.com/): the most modern
- [Zorin OS](https://zorinos.com/): the most user-friendly
- [Kubuntu](https://kubuntu.org/): the most customizable

</details>

### WSL (Windows Subsystem for Linux)

If you are hesitating between Windows and Linux, you can use the best of both
with WSL: basically, it is a Linux system which runs inside your Windows.

✅ Pros: you keep the Windows interface that you're familiar with, but you can
also use all the Linux tools for web development.

❌ Cons: your computer will consume more power and RAM to run both Windows
and Linux at the same time.

<details>
<summary>Instructions for WSL...</summary>

First, you need to install **WSL2** on your Windows. Follow the official instructions
of the Microsoft documentation to do this, because it can be a bit tricky.

Then, you need to pick a distribution to start with: we recommend you to use
_Ubuntu_.

Finally, you need to install all programs and tools for your Linux system:
to do so, follow this documentation using the _Linux_ tab each time instead of
the _Windows_ tab.

</details>
