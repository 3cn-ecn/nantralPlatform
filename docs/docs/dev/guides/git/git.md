---
last_update:
  date: 2023-02-07 14:58:56 +0100
  author: Alexis Delage
sidebar_position: 2
description: An easy tutorial for beginners with Git
---

# Git Tutorial

Let's learn git and github by a simple example: you will try to add your
name on the README.md page of the github project.

## Presentation

<iframe 
    class="youtube"
    src="https://www.youtube-nocookie.com/embed/hwP7WQkmECE" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
</iframe>

## Make your first commit

It's time to make your first commit! This page explains how to do it with Github
Desktop, for beginners. If you use another git interface or the git cli, we
suppose that you are able to transpose the actions with your git interface.

### 1. Create a new branch

* In Github Desktop, create a new branch from `master`, and give it a name.

![Create new branch](./new-branch-button-win.png)

:::info
We recommand you to create a new branch before writing new changes to the code. Indeed, the default selected branch
is `master`, which is the branch directly linked to the server. This branch is therefore protected, so you cannot
push changes on it.
:::

* Then publish your new branch to Github:

![Publish a branch](./publish-branch-button.png)

:::info
If you cannot publish the branch, that means that you do not have the right to write on the repository.
You can ask one of the administators of the repository (for example the president of the club) to grant you 
this access by adding you to the nantral-platform organization.
:::

### 2. Make your changes

* In VS Code, open the `README.md` file in the main directory.
* Add your name and a link to your github account under the `Contributors` section, at the end of the file
* Save the file

### 3. Publish your changes

* Now go back to Github Desktop, give a name to the commit and create it:

![Create commit](./commit-button.png)

* Then push your commit on the github server:

![Push a commit](./push-origin-button.png)

* Finally create a pull request:

![Create pull request](./create-pull-request.png)

* Now the github website should open in your browser. Click the *"Create pull request"* button, and then 
*"Merge pull request"*.

* Congratulations, you're done! 🥳 You can now see your name on the home page of the repository: 
    [github.com/3cn-ecn/nantralPlatform](https://github.com/3cn-ecn/nantralPlatform)


## Daily use

As a conclusion, just remember this: each time you want to contribute,
always start by creating a new branch. Then you can make your changes,
commit them and sync them on your branch.

Once you are satisfied with your changes, you can merge your branch into
the main one: this will automatically update the website! You can even follow
the deployment of your modifications in the **Actions** tab on Github.