"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[3534],{7099:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>l,default:()=>h,frontMatter:()=>r,metadata:()=>o,toc:()=>c});var i=t(4848),s=t(8453);const r={sidebar_position:8},l="Debugging",o={id:"dev/backend/debugging",title:"Debugging",description:"Welcome to the hell of all programmers! Don't worry, we will help you to get out",source:"@site/docs/dev/backend/debugging.mdx",sourceDirName:"dev/backend",slug:"/dev/backend/debugging",permalink:"/dev/backend/debugging",draft:!1,unlisted:!1,editUrl:"https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/docs/dev/backend/debugging.mdx",tags:[],version:"current",lastUpdatedBy:"Alexis Delage",lastUpdatedAt:1712699007e3,sidebarPosition:8,frontMatter:{sidebar_position:8},sidebar:"sidebar",previous:{title:"Dependencies (Pipenv)",permalink:"/dev/backend/dependencies"},next:{title:"Front End",permalink:"/dev/frontend/"}},d={},c=[{value:"Check-list",id:"check-list",level:2},{value:"If you&#39;re still stuck",id:"if-youre-still-stuck",level:2}];function a(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"debugging",children:"Debugging"}),"\n",(0,i.jsx)(n.p,{children:"Welcome to the hell of all programmers! Don't worry, we will help you to get out\nof your bug."}),"\n",(0,i.jsxs)(n.admonition,{title:"The Debugging Guide",type:"tip",children:[(0,i.jsxs)(n.p,{children:["If you didn't read this guide before, well, you ",(0,i.jsx)(n.strong,{children:"MUST"})," begin with it. It will\nsave you a lot of time!"]}),(0,i.jsxs)(n.p,{children:["\ud83d\udc49 ",(0,i.jsx)(n.strong,{children:(0,i.jsx)(n.a,{href:"https://debug.guide/",children:"The Debugging Guide: 20 simple steps to debug anything"})})," \ud83d\udc48"]})]}),"\n",(0,i.jsx)(n.h2,{id:"check-list",children:"Check-list"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Did you launch the backend with ",(0,i.jsx)(n.code,{children:"pipenv run start"})," ?"]}),"\n",(0,i.jsx)(n.li,{children:"Is the server still running?"}),"\n",(0,i.jsxs)(n.li,{children:["Did you pull the latest changes with ",(0,i.jsx)(n.code,{children:"git pull"}),"?"]}),"\n",(0,i.jsx)(n.li,{children:"Are you on the right branch?"}),"\n",(0,i.jsxs)(n.li,{children:["Did you install the latest dependencies with ",(0,i.jsx)(n.code,{children:"pipenv install"})," or ",(0,i.jsx)(n.code,{children:"make update"}),"?"]}),"\n",(0,i.jsxs)(n.li,{children:["Did you apply the latest migrations with ",(0,i.jsx)(n.code,{children:"pipenv run migrate"})," or ",(0,i.jsx)(n.code,{children:"make update"}),"?"]}),"\n",(0,i.jsxs)(n.li,{children:["Does the admin interface (",(0,i.jsx)(n.a,{href:"http://localhost:8000/admin",children:"http://localhost:8000/admin"}),") work?"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"if-youre-still-stuck",children:"If you're still stuck"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Reset the dependencies"}),":","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["remove the ",(0,i.jsx)(n.code,{children:".venv"})," folder and all of its content"]}),"\n",(0,i.jsxs)(n.li,{children:["run ",(0,i.jsx)(n.code,{children:"pipenv install"})]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Reset the database"}),":","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Rename your database file (for example ",(0,i.jsx)(n.code,{children:"db.sqlite3"})," to ",(0,i.jsx)(n.code,{children:"db.old.sqlite3"}),")"]}),"\n",(0,i.jsxs)(n.li,{children:["Run ",(0,i.jsx)(n.code,{children:"pipenv run migrate"})," to create a new database"]}),"\n",(0,i.jsxs)(n.li,{children:["Run ",(0,i.jsx)(n.code,{children:"pipenv run django createsuperuser"})," with ",(0,i.jsx)(n.em,{children:"username=admin"})," and\n",(0,i.jsx)(n.em,{children:"password=admin"})]}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"/dev/get-started/setup-project/#create-your-admin-account",children:"Create your account on the new database"})}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Ask Google/StackOverflow"}),": you will likely find an answer there.\nBe sure to make your search in English to get more results."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsxs)(n.strong,{children:["Ask an AI on ",(0,i.jsx)(n.a,{href:"https://poe.com",children:"Poe.com"})]}),": if you give enough context, it can\nbe very useful and save you a lot of time!"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Ask a human"}),": if you are stuck, you can ask for help on the Discord server\nin the ",(0,i.jsx)(n.em,{children:(0,i.jsx)(n.code,{children:"#je-gal\xe8re-avec-un-truc"})})," channel.\nBe sure to give enough context to your issue, and explain what you have\nalready tried.\nYou can also ask a teacher."]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(a,{...e})}):a(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>l,x:()=>o});var i=t(6540);const s={},r=i.createContext(s);function l(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:l(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);