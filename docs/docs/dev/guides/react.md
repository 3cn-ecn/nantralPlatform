---
sidebar_position: 4
---

# React


## Tutorial

Did you get the basis of django? Now, it's time to learn **React**!
You can follow the **[official tutorial of React here](https://reactjs.org/tutorial/tutorial.html)**
to get the basis of the framework.

:::note
For the *Setup* section, choose the option 2: *Local development environment*.
:::

## Why we need it

The framework we use for our backend can generate static html pages at runtime, on the server and serve it to the client. While this is desirable for performance reasons, this approach is not very modern, as a user expects to be able to interact with the website, like they would with a mobile application. Our server has to generate a new template everytime the user does something on the website, meaning the page has to be refreshed.

Imagine that you want to play a game of tic-tac-toe, but everytime you place an X or an O, the page has to be refreshed.
We can use a frontend framework like React.js to solve this problem for us.

## How our frontend is made

### React

To build the frontend of Nantral-Platform, we use [React.js](https://reactjs.org/),
a declarative, component based, JavaScript library for building user interfaces.
React (optionaly, but mostly) uses a language called JSX, which allows to organise
the frontend code in the form of components, that represents logical, reusable parts of the UI.
You can pass arguments to components, which you can then display in its body (like
the number of participants to an event). If the value changes, React will react and re-render the component.

<iframe 
    class="youtube"
    src="https://www.youtube-nocookie.com/embed/Tn6-PIqc4UM" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
</iframe>

### TypeScript

[TypeScript](https://www.typescriptlang.org/) is a superset of **JavaScript**, meaning that JavaScript code is valid TypeScript code, but not the other way around.

JavaScript is an interpreted, dynamic language, meaning that there is no compilation, and that broken code won't be detected until runtime. When dealing with APIs, it becomes very easy to reference a non-existent property on an object. For reference, if you open up your browser console with F12 and type:
`"1"==1` you will see that this boolean expression is evaluated as true, even though we are comparing two objects which have different types.

TypeScript solves this problem by introducing strong types to JavaScript, meaning that a number variable can only be a number, unless it is specifically casted as an other type. You can therefore catch errors in development, directly in your IDE with linting or when transpiling the TypeScript code to native JavaScript.

When using TypeScript, React code becomes TSX code instead of JSX.

It is configured through the `tsconfig.json` file in the `frontend/` folder.

As this part of the codebase has already been configured, we won't go into further details on how TypeScript works, as we do not need to worry about it anymore.

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

### Node.js

[Node.js](https://nodejs.org) is a JavaScript runtime built on Chrome's V8 JavaScript engine. To put it in a nutshell, it allows to run JavaScript on the serverside, and you need to install it to develop React applications.

### NPM

[NPM](https://www.npmjs.com/) or Node Package Manager is an online repository for sharing Node.js libraries. It's also a CLI to deal with the installation, update, etc, of said libraries.

It can be configured using the `package.json` file in the `frontend/` folder.

All the modules we talked about above can be installed using NPM.

## Implementation in Nantral-Platform

Whereas a lot of project use a fully featured React app with routing, we only have small components which hook to our static HTML pages, usually on the `<div id="root"></div>` element of the page.

The code of each component is located in `frontend/src/`.

While React does not impose a file structure like Django, we try to split the React code in multiple .tsx files, by keeping one component per file. This allows for better clarity in the codebase, as well as reusability of the components.

For a good example of how a React component should be structured, checkout `clubsList.tsx`.

## Writing your first React component

To create a component called `foo`, create the `foo.tsx` file in the `src/` folder. Add the following to the file:

```jsx
import * as React from "react";
import ReactDOM, { render } from "react-dom";

function Root(props): JSX.Element {
  return <h1>Hello World!</h1>;
}

render(<Root />, document.getElementById("root"));
```

To register the file with Webpack, open `src/webpack.config/webpack.common.js` and add `foo: path.join(__dirname,"../src/containers/foo.tsx"),` to the `entry` object.

Then run `npm run watch` to start compiling the React code on every file save.

This will output the compiled JavaScript to the `static/` folder of the project and allow Django to serve the files on page load.

In the HTML page you want your React code to load, add a `<div id="root"></div>` element to where you want your component to load, and the following snippet at the bottom of the page.

```html
{% block script %}
<script src='{% static "js/foo.js" %}'></script>
{% endblock %}
```

If you now try to load this page through Django, you should see a Hello World! where your div was added.
