"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[3749],{3725:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>o,default:()=>h,frontMatter:()=>a,metadata:()=>c,toc:()=>i});var r=t(4848),s=t(8453);const a={sidebar_position:4},o="Run the project",c={id:"dev/get-started/run-project",title:"Run the project",description:"Wow, you've successfully installed the project! \ud83c\udf89",source:"@site/docs/dev/get-started/run-project.mdx",sourceDirName:"dev/get-started",slug:"/dev/get-started/run-project",permalink:"/dev/get-started/run-project",draft:!1,unlisted:!1,editUrl:"https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/docs/dev/get-started/run-project.mdx",tags:[],version:"current",lastUpdatedBy:"Alexis Delage",lastUpdatedAt:1712699007e3,sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"sidebar",previous:{title:"First Launch",permalink:"/dev/get-started/setup-project/"},next:{title:"Learning",permalink:"/dev/learning/"}},d={},i=[{value:"Updates",id:"updates",level:2},{value:"Run the back end server (Django)",id:"run-the-back-end-server-django",level:2},{value:"Run the front end server (React)",id:"run-the-front-end-server-react",level:2}];function l(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",header:"header",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.R)(),...e.components},{Details:t}=n;return t||function(e,n){throw new Error("Expected "+(n?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"run-the-project",children:"Run the project"})}),"\n",(0,r.jsx)(n.p,{children:"Wow, you've successfully installed the project! \ud83c\udf89"}),"\n",(0,r.jsx)(n.p,{children:"Now, let's see how to start the project each time you want to work on it."}),"\n",(0,r.jsx)(n.h2,{id:"updates",children:"Updates"}),"\n",(0,r.jsx)(n.p,{children:"When someone else make changes on the project, you have to update your database\non your computer to avoid problems."}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["First, download the last commits on your local branch:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"git pull\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["Then, update the dependencies and your database:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"make update\n"})}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(t,{children:[(0,r.jsxs)("summary",{children:["Someone updated the ",(0,r.jsx)(n.code,{children:"master"})," branch, how to rebase my branch?"]}),(0,r.jsxs)(n.p,{children:["If you are working on a branch and someone else updated the ",(0,r.jsx)(n.code,{children:"master"})," branch,\nyou should rebase your branch on the ",(0,r.jsx)(n.code,{children:"master"})," branch to avoid conflicts."]}),(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["First, download the last commits on your local ",(0,r.jsx)(n.code,{children:"master"})," branch:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"git checkout master\ngit pull\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["Then, go back to your branch and rebase it on the ",(0,r.jsx)(n.code,{children:"master"})," branch:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"git checkout your-branch\ngit rebase master\n"})}),"\n","If you have conflicts, you have to resolve them and then continue the rebase:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"git rebase --continue\n"})}),"\n","If you want to cancel the rebase:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"git rebase --abort\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["Finally, if you already pushed your branch to GitHub, you have to force push it:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"git push --force\n"})}),"\n"]}),"\n"]}),(0,r.jsx)(n.admonition,{type:"warning",children:(0,r.jsxs)(n.p,{children:["Do ",(0,r.jsx)(n.strong,{children:"NOT"})," merge your branch with the ",(0,r.jsx)(n.code,{children:"master"})," branch, always rebase it.\nMerging will destroy the commits history of the project and make it harder to\nunderstand for reviewers."]})})]}),"\n",(0,r.jsx)(n.h2,{id:"run-the-back-end-server-django",children:"Run the back end server (Django)"}),"\n",(0,r.jsxs)(n.p,{children:["To run the backend, simply go into the ",(0,r.jsx)(n.code,{children:"backend"})," folder and start the server:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"cd backend/\npipenv run start\n"})}),"\n",(0,r.jsxs)(n.p,{children:["The server will be launched in the background. You can stop the\nserver at any time by simply pressing ",(0,r.jsx)("kbd",{children:"CTRL"}),"+",(0,r.jsx)("kbd",{children:"C"})," in the terminal."]}),"\n",(0,r.jsx)(n.p,{children:"When you edit a file of the backend, the changes will be automatically\ntaken into account: no need to relaunch the server."}),"\n",(0,r.jsx)(n.h2,{id:"run-the-front-end-server-react",children:"Run the front end server (React)"}),"\n",(0,r.jsx)(n.p,{children:"To run the front end, open a second terminal\n(you need to keep the django server running), and run these commands:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"cd frontend/\nnpm run start\n"})}),"\n",(0,r.jsxs)(n.p,{children:["You can now visit your browser at ",(0,r.jsx)(n.a,{href:"http://localhost:8000",children:"http://localhost:8000"}),"\nto see the result! \ud83e\udd73"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsxs)(n.admonition,{title:"Others npm packages",type:"note",children:[(0,r.jsxs)(n.p,{children:["You will notice 2 others packages in the Nantral Platform repo: ",(0,r.jsx)(n.code,{children:"docs"})," and\n",(0,r.jsx)(n.code,{children:"email-templates-generator"}),"."]}),(0,r.jsx)(n.p,{children:"You can read their README.md files to know how to run them. Most of the time,\nthey share the same commands as the frontend."})]})]})}function h(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(l,{...e})}):l(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>c});var r=t(6540);const s={},a=r.createContext(s);function o(e){const n=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),r.createElement(a.Provider,{value:n},e.children)}}}]);