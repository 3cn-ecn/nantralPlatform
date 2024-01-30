"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[6408],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>f});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),l=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},d=function(e){var t=l(e.components);return r.createElement(s.Provider,{value:t},e.children)},u="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,d=c(e,["components","mdxType","originalType","parentName"]),u=l(n),m=a,f=u["".concat(s,".").concat(m)]||u[m]||p[m]||i;return n?r.createElement(f,o(o({ref:t},d),{},{components:n})):r.createElement(f,o({ref:t},d))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=m;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c[u]="string"==typeof e?e:a,o[1]=c;for(var l=2;l<i;l++)o[l]=n[l];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},2991:(e,t,n)=>{n.d(t,{Z:()=>g});var r=n(7294),a=n(6010),i=n(3438),o=n(9960),c=n(3919),s=n(5999);const l={cardContainer:"cardContainer_fWXF",cardTitle:"cardTitle_rnsV",cardDescription:"cardDescription_PWke"};function d(e){let{href:t,children:n}=e;return r.createElement(o.Z,{href:t,className:(0,a.Z)("card padding--lg",l.cardContainer)},n)}function u(e){let{href:t,icon:n,title:i,description:o}=e;return r.createElement(d,{href:t},r.createElement("h2",{className:(0,a.Z)("text--truncate",l.cardTitle),title:i},n," ",i),o&&r.createElement("p",{className:(0,a.Z)("text--truncate",l.cardDescription),title:o},o))}function p(e){let{item:t}=e;const n=(0,i.Wl)(t);return n?r.createElement(u,{href:n,icon:"\ud83d\uddc3\ufe0f",title:t.label,description:t.description??(0,s.I)({message:"{count} items",id:"theme.docs.DocCard.categoryDescription",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t.items.length})}):null}function m(e){let{item:t}=e;const n=(0,c.Z)(t.href)?"\ud83d\udcc4\ufe0f":"\ud83d\udd17",a=(0,i.xz)(t.docId??void 0);return r.createElement(u,{href:t.href,icon:n,title:t.label,description:t.description??a?.description})}function f(e){let{item:t}=e;switch(t.type){case"link":return r.createElement(m,{item:t});case"category":return r.createElement(p,{item:t});default:throw new Error(`unknown item type ${JSON.stringify(t)}`)}}function y(e){let{className:t}=e;const n=(0,i.jA)();return r.createElement(g,{items:n.items,className:t})}function g(e){const{items:t,className:n}=e;if(!t)return r.createElement(y,e);const o=(0,i.MN)(t);return r.createElement("section",{className:(0,a.Z)("row",n)},o.map(((e,t)=>r.createElement("article",{key:t,className:"col col--6 margin-bottom--lg"},r.createElement(f,{item:e})))))}},7581:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>c,default:()=>m,frontMatter:()=>o,metadata:()=>s,toc:()=>d});var r=n(7462),a=(n(7294),n(3905)),i=n(2991);const o={sidebar_position:7,last_update:{date:"2024-01-30 12:11:39 -0500",author:"Corentin09"}},c="Testing",s={unversionedId:"dev/guides/tests/index",id:"dev/guides/tests/index",title:"Testing",description:"Everything you need to know to test your code!",source:"@site/docs/dev/guides/tests/index.md",sourceDirName:"dev/guides/tests",slug:"/dev/guides/tests/",permalink:"/dev/guides/tests/",draft:!1,editUrl:"https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/docs/dev/guides/tests/index.md",tags:[],version:"current",lastUpdatedBy:"Corentin09",lastUpdatedAt:1706634699,formattedLastUpdatedAt:"Jan 30, 2024",sidebarPosition:7,frontMatter:{sidebar_position:7,last_update:{date:"2024-01-30 12:11:39 -0500",author:"Corentin09"}},sidebar:"sidebar",previous:{title:"I18n",permalink:"/dev/guides/i18n"},next:{title:"Types",permalink:"/dev/guides/tests/types"}},l={},d=[],u={toc:d},p="wrapper";function m(e){let{components:t,...n}=e;return(0,a.kt)(p,(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"testing"},"Testing"),(0,a.kt)("p",null,"Everything you need to know to test your code!"),(0,a.kt)("admonition",{type:"info"},(0,a.kt)("p",{parentName:"admonition"},"You can run all the tests at once with the command:"),(0,a.kt)("pre",{parentName:"admonition"},(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"make test\n"))),(0,a.kt)("br",null),(0,a.kt)(i.Z,{mdxType:"DocCardList"}))}m.isMDXComponent=!0}}]);