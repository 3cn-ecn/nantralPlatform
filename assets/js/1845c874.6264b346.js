"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[8991],{3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return h}});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=a.createContext({}),p=function(e){var t=a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},s=function(e){var t=p(e.components);return a.createElement(c.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,c=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),u=p(n),h=o,m=u["".concat(c,".").concat(h)]||u[h]||d[h]||r;return n?a.createElement(m,i(i({ref:t},s),{},{components:n})):a.createElement(m,i({ref:t},s))}));function h(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,i=new Array(r);i[0]=u;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var p=2;p<r;p++)i[p]=n[p];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},9227:function(e,t,n){n.r(t),n.d(t,{assets:function(){return s},contentTitle:function(){return c},default:function(){return h},frontMatter:function(){return l},metadata:function(){return p},toc:function(){return d}});var a=n(7462),o=n(3366),r=(n(7294),n(3905)),i=["components"],l={title:"React Frontend",description:"Informations regarding the frontend of Nantral Platform with React",published:!0,date:new Date("2022-02-14T11:18:40.291Z"),editor:"markdown",dateCreated:new Date("2021-09-27T21:35:19.714Z")},c="Frontend with React",p={unversionedId:"local-dev/react",id:"local-dev/react",title:"React Frontend",description:"Informations regarding the frontend of Nantral Platform with React",source:"@site/docs/local-dev/react.md",sourceDirName:"local-dev",slug:"/local-dev/react",permalink:"/docs/local-dev/react",draft:!1,editUrl:"https://github.com/nantral-platform/nantralPlatform/tree/master/docs/docs/local-dev/react.md",tags:[],version:"current",frontMatter:{title:"React Frontend",description:"Informations regarding the frontend of Nantral Platform with React",published:!0,date:"2022-02-14T11:18:40.291Z",editor:"markdown",dateCreated:"2021-09-27T21:35:19.714Z"},sidebar:"tutorialSidebar",previous:{title:"Installing everything",permalink:"/docs/local-dev/installing-everything"},next:{title:"Testing your code",permalink:"/docs/local-dev/testing"}},s={},d=[{value:"Why we need it",id:"why-we-need-it",level:2},{value:"How our frontend is made",id:"how-our-frontend-is-made",level:2},{value:"React",id:"react",level:3},{value:"Babel",id:"babel",level:3},{value:"TypeScript",id:"typescript",level:3},{value:"Node.js",id:"nodejs",level:3},{value:"NPM",id:"npm",level:3},{value:"Webpack",id:"webpack",level:3},{value:"Implementation in Nantral-Platform",id:"implementation-in-nantral-platform",level:2},{value:"Writing your first React component",id:"writing-your-first-react-component",level:2},{value:"Setting it all up",id:"setting-it-all-up",level:3}],u={toc:d};function h(e){var t=e.components,n=(0,o.Z)(e,i);return(0,r.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"frontend-with-react"},"Frontend with React"),(0,r.kt)("h2",{id:"why-we-need-it"},"Why we need it"),(0,r.kt)("p",null,"The framework we use for our backend can generate static html pages at runtime, on the server and serve it to the client. While this is desirable for performance reasons, this approach is not very modern, as a user expects to be able to interact with the website, like they would with a mobile application. Our server has to generate a new template everytime the user does something on the website, meaning the page has to be refreshed."),(0,r.kt)("p",null,"Imagine that you want to play a game of tic-tac-toe, but everytime you place an X or an O, the page has to be refreshed."),(0,r.kt)("p",null,"We can use a frontend framework like React.js to solve this problem for us."),(0,r.kt)("h2",{id:"how-our-frontend-is-made"},"How our frontend is made"),(0,r.kt)("h3",{id:"react"},"React"),(0,r.kt)("p",null,"To build the frontend of Nantral-Platform, we use ",(0,r.kt)("a",{parentName:"p",href:"https://reactjs.org/"},"React.js"),", a declarative, component based, JavaScript library for building user interfaces."),(0,r.kt)("p",null,"React (optionaly, but mostly) uses a language called JSX, which allows to organise the frontend code in the form of components, that represents logical, reusable parts of the UI."),(0,r.kt)("p",null,"You can pass arguments to components, which you can then display in its body (like the number of participants to an event). If the value changes, React will react and re-render the component."),(0,r.kt)("p",null,"To learn more about React.js in 100 seconds, watch this video:\n",(0,r.kt)("a",{parentName:"p",href:"https://www.youtube.com/watch?v=Tn6-PIqc4UM",title:"React in 100 Seconds"},(0,r.kt)("img",{parentName:"a",src:"https://res.cloudinary.com/marcomontalbano/image/upload/v1632607714/video_to_markdown/images/youtube--Tn6-PIqc4UM-c05b58ac6eb4c4700831b2b3070cd403.jpg",alt:"React in 100 Seconds"}))),(0,r.kt)("h3",{id:"babel"},"Babel"),(0,r.kt)("p",null,"Web browsers can't understand JSX code, so we have to use ",(0,r.kt)("a",{parentName:"p",href:"https://babeljs.io/"},"Babel")," to convert that code into native JavaScript code."),(0,r.kt)("p",null,"It is configured through the ",(0,r.kt)("inlineCode",{parentName:"p"},".babelrc")," file in the ",(0,r.kt)("inlineCode",{parentName:"p"},"frontend/")," folder."),(0,r.kt)("p",null,"As this part of the codebase has already been configured, we won't go into further details on how Babel works, as we do not need to worry about it anymore."),(0,r.kt)("h3",{id:"typescript"},"TypeScript"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://www.typescriptlang.org/"},"TypeScript")," is a superset of JavaScript, meaning that JavaScript code is valid TypeScript code, but not the other way around."),(0,r.kt)("p",null,"JavaScript is an interpreted, dynamic language, meaning that there is no compilation, and that broken code won't be detected until runtime. When dealing with APIs, it becomes very easy to reference a non-existent property on an object. For reference, if you open up your browser console with F12 and type:\n",(0,r.kt)("inlineCode",{parentName:"p"},'"1"==1')," you will see that this boolean expression is evaluated as true, even though we are comparing two objects which have different types."),(0,r.kt)("p",null,"TypeScript solves this problem by introducing strong types to JavaScript, meaning that a number variable can only be a number, unless it is specifically casted as an other type. You can therefore catch errors in development, directly in your IDE with linting or when transpiling the TypeScript code to native JavaScript."),(0,r.kt)("p",null,"When using TypeScript, React code becomes TSX code instead of JSX."),(0,r.kt)("p",null,"It is configured through the ",(0,r.kt)("inlineCode",{parentName:"p"},"tsconfig.json")," file in the ",(0,r.kt)("inlineCode",{parentName:"p"},"frontend/")," folder."),(0,r.kt)("p",null,"As this part of the codebase has already been configured, we won't go into further details on how TypeScript works, as we do not need to worry about it anymore."),(0,r.kt)("p",null,"To learn more about TypeScript in 100 seconds, watch this video:\n",(0,r.kt)("a",{parentName:"p",href:"https://www.youtube.com/watch?v=zQnBQ4tB3ZA",title:"TypeScript in 100 Seconds"},(0,r.kt)("img",{parentName:"a",src:"https://res.cloudinary.com/marcomontalbano/image/upload/v1632608531/video_to_markdown/images/youtube--zQnBQ4tB3ZA-c05b58ac6eb4c4700831b2b3070cd403.jpg",alt:"TypeScript in 100 Seconds"}))),(0,r.kt)("h3",{id:"nodejs"},"Node.js"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://nodejs.org"},"Node.js")," is a JavaScript runtime built on Chrome's V8 JavaScript engine. To put it in a nutshell, it allows to run JavaScript on the serverside, and you need to install it to develop React applications."),(0,r.kt)("h3",{id:"npm"},"NPM"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://www.npmjs.com/"},"NPM")," or Node Package Manager is an online repository for sharing Node.js libraries. It's also a CLI to deal with the installation, update, etc, of said libraries."),(0,r.kt)("p",null,"It can be configured using the ",(0,r.kt)("inlineCode",{parentName:"p"},"package.json")," file in the ",(0,r.kt)("inlineCode",{parentName:"p"},"frontend/")," folder."),(0,r.kt)("p",null,"All the modules we talked about above can be installed using NPM."),(0,r.kt)("h3",{id:"webpack"},"Webpack"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://webpack.js.org/"},"Webpack.js")," is a JavaScript module bundler."),(0,r.kt)("p",null,"As we have seen, a Node.js application is usually built using NPM packages, like React.js, which itself is built using other NPM packages, and so on. This creates many dependencies which can be long to install for a client. Furthermore, a project does not usually use all of a package's code, meaning that some part of the package could be downloaded for nothing. Lastly, since JavaScript is an interpreted language, the smaller the file size, the faster the execution time."),(0,r.kt)("p",null,"Modules bundlers such as Webpack allow to combine all your project into a single minified JavaScript file, meaning that the file is only one line long, and that variables' name are shrunk down to their minimum."),(0,r.kt)("p",null,"This greatly improves loading times for the client, as well as general performances."),(0,r.kt)("p",null,"To read more on the topic of minifization, visit ",(0,r.kt)("a",{parentName:"p",href:"https://www.cloudflare.com/fr-fr/learning/performance/why-minify-javascript-code/"},"this CloudFlare article"),"."),(0,r.kt)("h2",{id:"implementation-in-nantral-platform"},"Implementation in Nantral-Platform"),(0,r.kt)("p",null,"Whereas a lot of project use a fully featured React app with routing, we only have small components which hook to our static HTML pages, usually on the ",(0,r.kt)("inlineCode",{parentName:"p"},'<div id="root"></div>')," element of the page."),(0,r.kt)("p",null,"The code of each component is located in ",(0,r.kt)("inlineCode",{parentName:"p"},"frontend/src/"),"."),(0,r.kt)("p",null,"While React does not impose a file structure like Django, we try to split the React code in multiple .tsx files, by keeping one component per file. This allows for better clarity in the codebase, as well as reusability of the components."),(0,r.kt)("p",null,"For a good example of how a React component should be structured, checkout ",(0,r.kt)("inlineCode",{parentName:"p"},"clubsList.tsx"),"."),(0,r.kt)("h2",{id:"writing-your-first-react-component"},"Writing your first React component"),(0,r.kt)("h3",{id:"setting-it-all-up"},"Setting it all up"),(0,r.kt)("p",null,"Make sure you have downloaded and installed Node.js and NPM. Then, ",(0,r.kt)("inlineCode",{parentName:"p"},"cd")," to ",(0,r.kt)("inlineCode",{parentName:"p"},"frontend/")," and type ",(0,r.kt)("inlineCode",{parentName:"p"},"npm i")," to install the needed packages."),(0,r.kt)("p",null,"To create a component called ",(0,r.kt)("inlineCode",{parentName:"p"},"foo"),", create the ",(0,r.kt)("inlineCode",{parentName:"p"},"foo.tsx")," file in the ",(0,r.kt)("inlineCode",{parentName:"p"},"src/")," folder. Add the following to the file:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},'import * as React from "react";\nimport ReactDOM, { render } from "react-dom";\n\nfunction Root(props): JSX.Element {\n  return <h1>Hello World!</h1>;\n}\n\nrender(<Root />, document.getElementById("root"));\n')),(0,r.kt)("p",null,"To register the file with Webpack, open ",(0,r.kt)("inlineCode",{parentName:"p"},"src/webpack.config/webpack.common.js")," and add ",(0,r.kt)("inlineCode",{parentName:"p"},'foo: path.join(__dirname,"../src/containers/foo.tsx"),')," to the ",(0,r.kt)("inlineCode",{parentName:"p"},"entry")," object."),(0,r.kt)("p",null,"Then run ",(0,r.kt)("inlineCode",{parentName:"p"},"npm run watch")," to start compiling the React code on every file save."),(0,r.kt)("p",null,"This will output the compiled JavaScript to the ",(0,r.kt)("inlineCode",{parentName:"p"},"static/")," folder of the project and allow Django to serve the files on page load."),(0,r.kt)("p",null,"In the HTML page you want your React code to load, add a ",(0,r.kt)("inlineCode",{parentName:"p"},'<div id="root"></div>')," element to where you want your component to load, and the following snippet at the bottom of the page."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-html"},"{% block script %}\n<script src='{% static \"js/foo.js\" %}'><\/script>\n{% endblock %}\n")),(0,r.kt)("p",null,"If you now try to load this page through Django, you should see a Hello World! where your div was added."))}h.isMDXComponent=!0}}]);