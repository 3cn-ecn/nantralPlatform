"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[2281],{9519:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>s,default:()=>m,frontMatter:()=>a,metadata:()=>o,toc:()=>l});var r=n(5893),i=n(1151),c=n(2991);const a={sidebar_position:3},s="Back End",o={id:"dev/backend/index",title:"Back End",description:"Everything about the backend of Nantral Platform.",source:"@site/docs/dev/backend/index.md",sourceDirName:"dev/backend",slug:"/dev/backend/",permalink:"/dev/backend/",draft:!1,unlisted:!1,editUrl:"https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/docs/dev/backend/index.md",tags:[],version:"current",lastUpdatedBy:"Alexis Delage",lastUpdatedAt:1708213114,formattedLastUpdatedAt:"Feb 17, 2024",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"sidebar",previous:{title:"GitHub Desktop Tutorial",permalink:"/dev/learning/git-tutorials/github-desktop-tutorial"},next:{title:"Architecture",permalink:"/dev/backend/architecture/"}},d={},l=[];function u(e){const t={h1:"h1",p:"p",...(0,i.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h1,{id:"back-end",children:"Back End"}),"\n",(0,r.jsx)(t.p,{children:"Everything about the backend of Nantral Platform."}),"\n","\n","\n",(0,r.jsx)(c.Z,{})]})}function m(e={}){const{wrapper:t}={...(0,i.a)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(u,{...e})}):u(e)}},2991:(e,t,n)=>{n.d(t,{Z:()=>b});n(7294);var r=n(512),i=n(3438),c=n(3692),a=n(3919),s=n(5999),o=n(2503);const d={cardContainer:"cardContainer_fWXF",cardTitle:"cardTitle_rnsV",cardDescription:"cardDescription_PWke"};var l=n(5893);function u(e){let{href:t,children:n}=e;return(0,l.jsx)(c.Z,{href:t,className:(0,r.Z)("card padding--lg",d.cardContainer),children:n})}function m(e){let{href:t,icon:n,title:i,description:c}=e;return(0,l.jsxs)(u,{href:t,children:[(0,l.jsxs)(o.Z,{as:"h2",className:(0,r.Z)("text--truncate",d.cardTitle),title:i,children:[n," ",i]}),c&&(0,l.jsx)("p",{className:(0,r.Z)("text--truncate",d.cardDescription),title:c,children:c})]})}function p(e){let{item:t}=e;const n=(0,i.LM)(t);return n?(0,l.jsx)(m,{href:n,icon:"\ud83d\uddc3\ufe0f",title:t.label,description:t.description??(0,s.I)({message:"{count} items",id:"theme.docs.DocCard.categoryDescription",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t.items.length})}):null}function f(e){let{item:t}=e;const n=(0,a.Z)(t.href)?"\ud83d\udcc4\ufe0f":"\ud83d\udd17",r=(0,i.xz)(t.docId??void 0);return(0,l.jsx)(m,{href:t.href,icon:n,title:t.label,description:t.description??r?.description})}function h(e){let{item:t}=e;switch(t.type){case"link":return(0,l.jsx)(f,{item:t});case"category":return(0,l.jsx)(p,{item:t});default:throw new Error(`unknown item type ${JSON.stringify(t)}`)}}function x(e){let{className:t}=e;const n=(0,i.jA)();return(0,l.jsx)(b,{items:n.items,className:t})}function b(e){const{items:t,className:n}=e;if(!t)return(0,l.jsx)(x,{...e});const c=(0,i.MN)(t);return(0,l.jsx)("section",{className:(0,r.Z)("row",n),children:c.map(((e,t)=>(0,l.jsx)("article",{className:"col col--6 margin-bottom--lg",children:(0,l.jsx)(h,{item:e})},t)))})}},1151:(e,t,n)=>{n.d(t,{Z:()=>s,a:()=>a});var r=n(7294);const i={},c=r.createContext(i);function a(e){const t=r.useContext(c);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),r.createElement(c.Provider,{value:t},e.children)}}}]);