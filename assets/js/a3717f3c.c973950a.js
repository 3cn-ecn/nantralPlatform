"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[8401],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>f});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),l=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},u=function(e){var t=l(e.components);return n.createElement(s.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},h=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),p=l(r),h=a,f=p["".concat(s,".").concat(h)]||p[h]||d[h]||i;return r?n.createElement(f,o(o({ref:t},u),{},{components:r})):n.createElement(f,o({ref:t},u))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,o=new Array(i);o[0]=h;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c[p]="string"==typeof e?e:a,o[1]=c;for(var l=2;l<i;l++)o[l]=r[l];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}h.displayName="MDXCreateElement"},1646:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>c,toc:()=>l});var n=r(7462),a=(r(7294),r(3905));const i={sidebar_position:1},o="Architecture",c={unversionedId:"dev/guides/architecture/architecture",id:"dev/guides/architecture/architecture",title:"Architecture",description:"Discover the main architecture of the Nantral Platform project.",source:"@site/docs/dev/guides/architecture/architecture.md",sourceDirName:"dev/guides/architecture",slug:"/dev/guides/architecture/",permalink:"/dev/guides/architecture/",draft:!1,editUrl:"https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/docs/dev/guides/architecture/architecture.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"sidebar",previous:{title:"Guides",permalink:"/dev/guides/"},next:{title:"Git Tutorial",permalink:"/dev/guides/git/"}},s={},l=[{value:"Definitions",id:"definitions",level:2},{value:"Languages and frameworks",id:"languages-and-frameworks",level:2}],u={toc:l},p="wrapper";function d(e){let{components:t,...i}=e;return(0,a.kt)(p,(0,n.Z)({},u,i,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"architecture"},"Architecture"),(0,a.kt)("p",null,"Discover the main architecture of the Nantral Platform project."),(0,a.kt)("p",null,(0,a.kt)("a",{target:"_blank",href:r(2464).Z},(0,a.kt)("img",{alt:"Sch\xe9ma de l&#39;architecture g\xe9n\xe9rale",src:r(2519).Z,width:"1920",height:"1380"}))),(0,a.kt)("h2",{id:"definitions"},"Definitions"),(0,a.kt)("p",null,"First, you need to understand the difference between frontend and backend:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("strong",{parentName:"li"},"the front end"),": it is the code which is compiled and run on the ",(0,a.kt)("strong",{parentName:"li"},"client"),", that is to say in the own browser\nof the user. Its purpose is to simulate the behavior of a regular application."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("strong",{parentName:"li"},"the back end"),": it is the code which will run on the ",(0,a.kt)("strong",{parentName:"li"},"server"),". Its purpose is to make the link between the frontend\nand the database: when a user register himself in a group for example, the frontend will send a request to the\nbackend, and then the backend will verify the rights of the user and update the database in consequence.")),(0,a.kt)("h2",{id:"languages-and-frameworks"},"Languages and frameworks"),(0,a.kt)("p",null,"For the nantral platform project, we use two main languages and frameworks for the backend and the frontend:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("strong",{parentName:"li"},"on the back end"),": we use ",(0,a.kt)("a",{parentName:"li",href:"https://www.python.org/"},"Python"),", with the framework ",(0,a.kt)("a",{parentName:"li",href:"https://www.djangoproject.com/"},"django")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("strong",{parentName:"li"},"on the front end"),": we use ",(0,a.kt)("a",{parentName:"li",href:"https://www.typescriptlang.org/"},"TypeScript"),", with the framework ",(0,a.kt)("a",{parentName:"li",href:"https://reactjs.org/"},"React"))),(0,a.kt)("admonition",{title:"What is a framework?",type:"info"},(0,a.kt)("p",{parentName:"admonition"},"A framework is a module, or a library, with a set of predefined useful functions to achieve a certain goal.\nFor instance, django gives functions to connect to the database or to manage the http protocol, so as we don't have\nto implement these functions ourselves.")))}d.isMDXComponent=!0},2464:(e,t,r)=>{r.d(t,{Z:()=>n});const n=r.p+"assets/files/architecture-48be00ab7530f9389c8baaac8748bb2d.png"},2519:(e,t,r)=>{r.d(t,{Z:()=>n});const n=r.p+"assets/images/architecture-48be00ab7530f9389c8baaac8748bb2d.png"}}]);