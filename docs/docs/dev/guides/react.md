---
last_update:
  date: 2023-02-17 16:11:25 +0100
  author: Alexis Delage
sidebar_position: 4
description: A JavaScript library for building user interfaces.
---

# React

- **[OpenClassrooms Tutorial](https://openclassrooms.com/fr/courses/7008001-debutez-avec-react)** (recommended, in French)
- **[MDN Tutorial](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started)** (available in multiple languages)
- **[Official Documentation](https://reactjs.org/)**

<iframe 
    className="youtube margin-bottom--md"
    src="https://www.youtube-nocookie.com/embed/Tn6-PIqc4UM" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
</iframe>

Other videos to see: [JavaScript in 100s](https://www.youtube.com/watch?v=DHjqpvDnNGE)
and [TypeScript in 100s](https://www.youtube.com/watch?v=zQnBQ4tB3ZA).

## How our frontend is made

### Vite

[Vite](https://vitejs.dev/) is a build tool for frontend applications.
It is configured through the `vite.config.ts` file in the `frontend/` folder.
It is used to transpile the TypeScript code to JavaScript, and to optimize the
code for production.

### React

[React.js](https://reactjs.org/) is a declarative, component based, JavaScript
library for building user interfaces. React uses a language called JSX, which
allows to organise the frontend code in the form of components, that represents
logical, reusable parts of the UI. You can pass arguments to components, which
you can then display in its body (like the number of participants to an event).
If the value changes, React will react and re-render the component.

### TypeScript

[TypeScript](https://www.typescriptlang.org/) is a superset of **JavaScript**,
meaning that JavaScript code is valid TypeScript code, but not the other way
around.

JavaScript is an interpreted, dynamic language, meaning that there is no
compilation, and that broken code won't be detected until runtime. For example,
if you type: `"1"==1`, you will see that this boolean expression is evaluated as
true, even though we are comparing two objects which have different types.

TypeScript solves this problem by introducing types to JavaScript,
meaning that a number variable can only be a number, unless it is specifically
casted as an other type. You can therefore catch errors in development when
transpiling the TypeScript code to native JavaScript.

When using TypeScript, React code becomes TSX code instead of JSX.
It is configured through the `tsconfig.json` file in the `frontend/` folder.

### Node.js

[Node.js](https://nodejs.org) is a JavaScript runtime built on Chrome's V8
JavaScript engine. To put it in a nutshell, it allows to run JavaScript on the
serverside, and you need to install it to develop React applications.

### NPM

[NPM](https://www.npmjs.com/) or Node Package Manager is an online repository
for sharing Node.js libraries. It's also a CLI to deal with the installation,
update, etc, of said libraries.

It can be configured using the `package.json` file in the `frontend/` folder.

All the modules we talked about above can be installed using NPM.
