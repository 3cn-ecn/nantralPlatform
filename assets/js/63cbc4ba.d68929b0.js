"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[2431],{6648:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>d,contentTitle:()=>s,default:()=>h,frontMatter:()=>t,metadata:()=>l,toc:()=>c});var r=o(4848),i=o(8453);const t={title:"Debugging in production",description:"How to debug your code in production"},s="Debugging in production",l={id:"dev/server/debugging",title:"Debugging in production",description:"How to debug your code in production",source:"@site/docs/dev/server/debugging.mdx",sourceDirName:"dev/server",slug:"/dev/server/debugging",permalink:"/dev/server/debugging",draft:!1,unlisted:!1,editUrl:"https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/docs/dev/server/debugging.mdx",tags:[],version:"current",lastUpdatedBy:"Alexis Delage",lastUpdatedAt:1712699007e3,frontMatter:{title:"Debugging in production",description:"How to debug your code in production"},sidebar:"sidebar",previous:{title:"Backup the database",permalink:"/dev/server/backup-db"},next:{title:"Email server",permalink:"/dev/server/emails"}},d={},c=[{value:"Deployment logs",id:"deployment-logs",level:2},{value:"Errors while building",id:"errors-while-building",level:3},{value:"Errors while running the containers",id:"errors-while-running-the-containers",level:3},{value:"Django production logs",id:"django-production-logs",level:2}];function a(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",strong:"strong",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"debugging-in-production",children:"Debugging in production"}),"\n",(0,r.jsx)(n.p,{children:"There are several failure points that we can look into to try and find the cause of a bug."}),"\n",(0,r.jsx)(n.h2,{id:"deployment-logs",children:"Deployment logs"}),"\n",(0,r.jsxs)(n.p,{children:["If a problem happens during deployment, you can check the status of the GitHub Action responsible for deploying the latest pull request to production ",(0,r.jsx)(n.a,{href:"https://github.com/3cn-ecn/nantralPlatform/actions",children:"here"}),". This should provide enough informations for deployment related issues."]}),"\n",(0,r.jsx)(n.p,{children:"The deployment pipeline is split into two parts:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:"Building the containers swarm."}),"\n",(0,r.jsx)(n.li,{children:"Running the containers."}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"We will see how to debug both processes."}),"\n",(0,r.jsx)(n.admonition,{type:"info",children:(0,r.jsxs)(n.p,{children:["In the following section, all ",(0,r.jsx)(n.code,{children:"docker-compose"})," commands ",(0,r.jsx)(n.strong,{children:"in production"})," are replaced with the\nalias ",(0,r.jsx)(n.code,{children:"dcf"})," which stands for ",(0,r.jsx)(n.code,{children:"docker-compose -f docker-compose.yml -f docker-compose.prod.yml"})]})}),"\n",(0,r.jsx)(n.h3,{id:"errors-while-building",children:"Errors while building"}),"\n",(0,r.jsx)(n.p,{children:"The build logs should be available in the GitHub Action logs like described above.\nIf you need more informations, re-run the build directly on the server:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:"Connect to the server using SSH."}),"\n",(0,r.jsxs)(n.li,{children:["Go to nantralPlatform/deployment by running ",(0,r.jsx)(n.code,{children:"cd nantralPlatform/deployment"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["Run ",(0,r.jsx)(n.code,{children:"sudo dcf build"})," to re-build the containers."]}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"errors-while-running-the-containers",children:"Errors while running the containers"}),"\n",(0,r.jsx)(n.p,{children:"Even if the docker-compose build ran successfuly, containers can still be prone to errors. If an error happens, you can debug the swarm by following the steps below:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:"Connect to the server using SSH."}),"\n",(0,r.jsxs)(n.li,{children:["Go to nantralPlatform/deployment by running ",(0,r.jsx)(n.code,{children:"cd nantralPlatform/deployment"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["Run ",(0,r.jsx)(n.code,{children:"dcf logs --follow"}),"."]}),"\n",(0,r.jsx)(n.li,{children:"Press ctrl+C to exit."}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["If the containers are not running, use: ",(0,r.jsx)(n.code,{children:"dcf up"})," to bring them online."]}),"\n",(0,r.jsxs)(n.p,{children:["Once you are done debugging, press ctrl+C to exit and then run ",(0,r.jsx)(n.code,{children:"dcf down && dcf up -d"})," to bring the containers back online in detached mode."]}),"\n",(0,r.jsx)(n.h2,{id:"django-production-logs",children:"Django production logs"}),"\n",(0,r.jsx)(n.p,{children:"If a bug happens in the backend code (i.e a 500 error), you can most likely find its traceback in the container's logs."}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:"Connect to the server using SSH."}),"\n",(0,r.jsxs)(n.li,{children:["Run ",(0,r.jsx)(n.code,{children:"dcf logs backend --follow"}),"."]}),"\n",(0,r.jsx)(n.li,{children:"Once you are done, press CTRL+C to exit."}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(a,{...e})}):a(e)}},8453:(e,n,o)=>{o.d(n,{R:()=>s,x:()=>l});var r=o(6540);const i={},t=r.createContext(i);function s(e){const n=r.useContext(t);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),r.createElement(t.Provider,{value:n},e.children)}}}]);