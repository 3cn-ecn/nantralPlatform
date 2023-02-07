"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[295],{3905:(e,t,r)=>{r.d(t,{Zo:()=>l,kt:()=>f});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},c=Object.keys(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var d=n.createContext({}),s=function(e){var t=n.useContext(d),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},l=function(e){var t=s(e.components);return n.createElement(d.Provider,{value:t},e.children)},u="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,c=e.originalType,d=e.parentName,l=o(e,["components","mdxType","originalType","parentName"]),u=s(r),m=a,f=u["".concat(d,".").concat(m)]||u[m]||p[m]||c;return r?n.createElement(f,i(i({ref:t},l),{},{components:r})):n.createElement(f,i({ref:t},l))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var c=r.length,i=new Array(c);i[0]=m;var o={};for(var d in t)hasOwnProperty.call(t,d)&&(o[d]=t[d]);o.originalType=e,o[u]="string"==typeof e?e:a,i[1]=o;for(var s=2;s<c;s++)i[s]=r[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},2991:(e,t,r)=>{r.d(t,{Z:()=>v});var n=r(7294),a=r(6010),c=r(3438),i=r(9960),o=r(3919),d=r(5999);const s={cardContainer:"cardContainer_fWXF",cardTitle:"cardTitle_rnsV",cardDescription:"cardDescription_PWke"};function l(e){let{href:t,children:r}=e;return n.createElement(i.Z,{href:t,className:(0,a.Z)("card padding--lg",s.cardContainer)},r)}function u(e){let{href:t,icon:r,title:c,description:i}=e;return n.createElement(l,{href:t},n.createElement("h2",{className:(0,a.Z)("text--truncate",s.cardTitle),title:c},r," ",c),i&&n.createElement("p",{className:(0,a.Z)("text--truncate",s.cardDescription),title:i},i))}function p(e){let{item:t}=e;const r=(0,c.Wl)(t);return r?n.createElement(u,{href:r,icon:"\ud83d\uddc3\ufe0f",title:t.label,description:(0,d.I)({message:"{count} items",id:"theme.docs.DocCard.categoryDescription",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t.items.length})}):null}function m(e){let{item:t}=e;const r=(0,o.Z)(t.href)?"\ud83d\udcc4\ufe0f":"\ud83d\udd17",a=(0,c.xz)(t.docId??void 0);return n.createElement(u,{href:t.href,icon:r,title:t.label,description:a?.description})}function f(e){let{item:t}=e;switch(t.type){case"link":return n.createElement(m,{item:t});case"category":return n.createElement(p,{item:t});default:throw new Error(`unknown item type ${JSON.stringify(t)}`)}}function g(e){let{className:t}=e;const r=(0,c.jA)();return n.createElement(v,{items:r.items,className:t})}function v(e){const{items:t,className:r}=e;if(!t)return n.createElement(g,e);const i=(0,c.MN)(t);return n.createElement("section",{className:(0,a.Z)("row",r)},i.map(((e,t)=>n.createElement("article",{key:t,className:"col col--6 margin-bottom--lg"},n.createElement(f,{item:e})))))}},3969:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>m,frontMatter:()=>i,metadata:()=>d,toc:()=>l});var n=r(7462),a=(r(7294),r(3905)),c=r(2991);const i={sidebar_position:3},o="Advanced Guides",d={unversionedId:"dev/advanced-guides/index",id:"dev/advanced-guides/index",title:"Advanced Guides",description:"More advanced guides about specific topic of the project.",source:"@site/docs/dev/advanced-guides/index.md",sourceDirName:"dev/advanced-guides",slug:"/dev/advanced-guides/",permalink:"/dev/advanced-guides/",draft:!1,editUrl:"https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/docs/dev/advanced-guides/index.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"sidebar",previous:{title:"Debugging",permalink:"/dev/guides/debugging"},next:{title:"Database",permalink:"/dev/advanced-guides/database"}},s={},l=[],u={toc:l},p="wrapper";function m(e){let{components:t,...r}=e;return(0,a.kt)(p,(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"advanced-guides"},"Advanced Guides"),(0,a.kt)("p",null,"More advanced guides about specific topic of the project."),(0,a.kt)(c.Z,{mdxType:"DocCardList"}))}m.isMDXComponent=!0}}]);