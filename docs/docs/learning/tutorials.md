---
title: Tutorials
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Tutorials

Before doing your first steps on Nantral Platform, you might need to learn how to use the different frameworks we use
on the Nantral Platform project. Let's follow the steps!

## The basics of the web: backend and frontend

### Definitions

First, you need to understand the difference between frontend and backend:
* **the frontend**: it is the code which is compiled and run on the **client**, that is to say in the own browser
    of the user. Its purpose is to simulate the behavior of a regular application.
* **the backend**: it is the code which will run on the **server**. Its purpose is to make the link between the frontend
    and the database: when a user register himself in a group for example, the frontend will send a request to the
    backend, and then the backend will verify the rights of the user and update the database in consequence.

### Languages and frameworks

For the nantral platform project, we use two main languages and frameworks for the backend and the frontend:
* **on the backend**: we use [Python](https://www.python.org/), with the framework [django](https://www.djangoproject.com/)
* **on the frontend**: we use [TypeScript](https://www.typescriptlang.org/), with the framework [React](https://reactjs.org/)

:::info What is a framework?
A framework is a module, or a library, with a set of predefined useful functions to achieve a certain goal.
For instance, django gives functions to connect to the database or to manage the http protocol, so as we don't have
to implement these functions ourselves.
:::


## Learn django

Firts, let's begin with django! 
Follow this tutorial to learn how to use django and what it can do for you: [Django Web Framework (Python) - 
Learn Web Development | MDN](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django).

:::tip Steps to skip
In this tutorial, you can skip some steps:
* In the **Setting up a Django development environment** page, you can skip the
    **Install Python 3** section, and the 
    **Using Django inside a Python virtual environment**. Instead, create a
    virtual environment with the easier method described in the
    *[How to use Python Virtualenv](/docs/learning/virtualenv)* page.
* You can also skip the **Sessions framework**, **Working with forms**, and
    **Deploying Django to production** pages.
:::

## Learn React

Did you get the basis of django? Now, it's time to learn **React**!

<details>
    <summary>Discover React in 100s 🎬</summary>
    <iframe 
        class="youtube"
        src="https://www.youtube-nocookie.com/embed/Tn6-PIqc4UM" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
    </iframe>
</details>

React is a framework for the javascript language. In our case, we will use it with the typescript language,
which is a variant of javascript (see the videos below).

<details>
    <summary>Discover Javascript in 100s 🎬</summary>
    <iframe 
        class="youtube"
        src="https://www.youtube-nocookie.com/embed/DHjqpvDnNGE" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
    </iframe>
</details>
<details>
    <summary>Discover Typescript in 100s 🎬</summary>
    <iframe 
        class="youtube"
        src="https://www.youtube-nocookie.com/embed/zQnBQ4tB3ZA" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
    </iframe>
</details>

Now, you can follow the **[official tutorial of React](https://reactjs.org/tutorial/tutorial.html)**
to get the basis of the framework!

:::note
For the *Setup* section, choose the option 2: *Local development environment*.
:::

## The REST API: make React and django work together

:::warning JUST DO IT!
This tutorial gather all the core principles of Django and React and show 
how they can work together. It is also very fast to do, so be sure to do
at least this tutorial if you are hurry!
:::

Now that you know how to make the backend and the frontend, it's time to put them together, using REST API.

<details>
    <summary>Discover REST API in 100s 🎬</summary>
    <iframe 
        class="youtube"
        src="https://www.youtube-nocookie.com/embed/-MTSQjw5DrM" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
    </iframe>
</details>

To learn this concept, you will create your own application with React, django, and REST API:
[follow this tutorial!](https://blog.logrocket.com/creating-an-app-with-react-and-django/)


## The youtube player mini-project

Now to conclude, let's time to create your own mini-project with all the elements we have seen!

Your goal is to create a youtube player, with a support for history. You will have to use django as the backend and 
use react as the frontend. Your project should do the following:
* The interface should have an input field where the user can paste the url of a youtube video
* You should be able to show and play the requested video in your interface
* When you open a new video, this video is saved into the history, in the database of django
* You should have a place in your interface to see all the videos of the history (it can be only their urls)

Good luck! 😎