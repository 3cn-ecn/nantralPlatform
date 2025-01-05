"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[4010],{2409:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>i,contentTitle:()=>d,default:()=>h,frontMatter:()=>t,metadata:()=>o,toc:()=>l});const o=JSON.parse('{"id":"dev/server/docker","title":"Docker","description":"Why using docker on local development?","source":"@site/docs/dev/server/docker.mdx","sourceDirName":"dev/server","slug":"/dev/server/docker","permalink":"/dev/server/docker","draft":false,"unlisted":false,"editUrl":"https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/docs/dev/server/docker.mdx","tags":[],"version":"current","lastUpdatedBy":"Alexis Delage","lastUpdatedAt":1712699007000,"sidebarPosition":4,"frontMatter":{"sidebar_position":4},"sidebar":"sidebar","previous":{"title":"Staging Server","permalink":"/dev/server/staging-server/"},"next":{"title":"Backup the database","permalink":"/dev/server/backup-db"}}');var s=r(4848),c=r(8453);const t={sidebar_position:4},d="Docker",i={},l=[{value:"Why using docker on local development?",id:"why-using-docker-on-local-development",level:2},{value:"How to run docker for local dev",id:"how-to-run-docker-for-local-dev",level:2},{value:"Which services are launch?",id:"which-services-are-launch",level:2},{value:"How to run docker for production server",id:"how-to-run-docker-for-production-server",level:2}];function a(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",header:"header",li:"li",mdxAdmonitionTitle:"mdxAdmonitionTitle",ol:"ol",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,c.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"docker",children:"Docker"})}),"\n",(0,s.jsx)(n.h2,{id:"why-using-docker-on-local-development",children:"Why using docker on local development?"}),"\n",(0,s.jsx)(n.p,{children:"Docker is used to manage the code on our server. By using it on your local\nmachine, you will be able to reproduce an environment very close to the\ndeployment one, and so it will be easier to track issues before they appear."}),"\n",(0,s.jsx)(n.p,{children:"In practice, using Docker on your local machine will allow you to:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Use the cache system"}),": Django comes with a cachin system, that you can\nonly use with Docker"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Use the Postgres database"}),": by default the database uses SQLite, but\nthe deployment database uses postgresql, and so Docker does"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Use the celery service"}),": the celery service allow you to run asynchronous\ntasks on the server from the backend"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Uses more debug tools"}),": with Docker, you can for instance access directly\nyour database using PgAdmin for example, or use the Workers Dashboard for\ncelery tasks"]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"how-to-run-docker-for-local-dev",children:"How to run docker for local dev"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["Install docker-desktop from the official website:\n",(0,s.jsx)(n.a,{href:"https://docs.docker.com/get-docker/",children:"docs.docker.com/get-docker"})]}),"\n",(0,s.jsxs)(n.li,{children:["Add the ",(0,s.jsx)(n.em,{children:'"docker needed"'})," variables in your ",(0,s.jsx)(n.code,{children:".env"})," environment file.\nIt must be at this place: ",(0,s.jsx)(n.code,{children:"backend/config/settings/.env"})]}),"\n",(0,s.jsxs)(n.li,{children:["Go to the ",(0,s.jsx)(n.code,{children:"deployment"})," directory: ",(0,s.jsx)(n.code,{children:"cd deployment/"})]}),"\n",(0,s.jsxs)(n.li,{children:["Create an empty file ",(0,s.jsx)(n.code,{children:"backend.env"})," in this directory"]}),"\n",(0,s.jsxs)(n.li,{children:["Build the containers: ",(0,s.jsx)(n.code,{children:"docker-compose build"})]}),"\n",(0,s.jsxs)(n.li,{children:["Start the services: ",(0,s.jsx)(n.code,{children:"docker-compose up"})]}),"\n",(0,s.jsxs)(n.li,{children:["Try to connect to ",(0,s.jsx)(n.code,{children:"http://localhost"})," in your browser."]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"If you can access the login page, congratulations everything is ok! \ud83e\udd73"}),"\n",(0,s.jsxs)(n.p,{children:["Let's create a superuser account now, so that you can connect. For this, follow the\ntutorial ",(0,s.jsx)(n.a,{href:"/dev/get-started/setup-project/#create-your-admin-account",children:"here"}),". You only have to replace\nthe command for creating a superuser by:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"docker-compose exec backend python3 manage.py createsuperuser\n"})}),"\n",(0,s.jsxs)(n.p,{children:["You can run this command in another terminal (but always in the ",(0,s.jsx)(n.code,{children:"deployment"})," directory)."]}),"\n",(0,s.jsx)(n.admonition,{title:"Useful tips",type:"success",children:(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["You can stop docker by pressing ",(0,s.jsx)("kbd",{children:"CTRL"}),"+",(0,s.jsx)("kbd",{children:"C"})," in the console if docker\nis running, or by running the command ",(0,s.jsx)(n.code,{children:"docker-compose down"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You can also launch docker services in background by adding the\n",(0,s.jsx)(n.code,{children:"-d"})," argument on the up command."]}),"\n",(0,s.jsxs)(n.li,{children:["If you want to be faster, you can run both command at once by\nusing ",(0,s.jsx)(n.code,{children:"docker-compose up --build"})]}),"\n"]})}),"\n",(0,s.jsxs)(n.admonition,{type:"note",children:[(0,s.jsx)(n.mdxAdmonitionTitle,{children:(0,s.jsx)(n.strong,{children:"What does it do?"})}),(0,s.jsxs)(n.p,{children:["When you run ",(0,s.jsx)(n.code,{children:"docker-compose"})," without specifying the files to run, it\nruns by default ",(0,s.jsx)(n.code,{children:"docker-compose.yml"})," and then ",(0,s.jsx)(n.code,{children:"docker-compose.override.yml"}),".\nIt is equivalent to run:"]}),(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build\n"})}),(0,s.jsx)(n.p,{children:"In our case, the files are configured to run the backend (with django),\nan instance of postgresql (the database), and the celery services (for\nbackground tasks)."})]}),"\n",(0,s.jsx)(n.h2,{id:"which-services-are-launch",children:"Which services are launch?"}),"\n",(0,s.jsx)(n.p,{children:"These services are launch when you run Docker on your local machine:"}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"Service"}),(0,s.jsx)(n.th,{children:"Description"}),(0,s.jsx)(n.th,{children:"Access"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"database"}),(0,s.jsx)(n.td,{children:"The postgresql database for the website"}),(0,s.jsxs)(n.td,{children:["You can read it by connecting to the port 5432 on localhost with ",(0,s.jsx)(n.a,{href:"https://www.pgadmin.org/download/",children:"PgAdmin4"}),", and using the credentials defined in your ",(0,s.jsx)(n.code,{children:".env"})," file"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"backend"}),(0,s.jsx)(n.td,{children:"The django server which serve files"}),(0,s.jsxs)(n.td,{children:["Open ",(0,s.jsx)(n.a,{href:"http://localhost",children:"http://localhost"})," in your browser"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"nginx"}),(0,s.jsx)(n.td,{children:"Used to serve the backend and the static files"}),(0,s.jsx)(n.td,{children:"-"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"redis"}),(0,s.jsx)(n.td,{children:"Used for the django cache system"}),(0,s.jsx)(n.td,{children:"-"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"celery"}),(0,s.jsx)(n.td,{children:"Used for asynchronous tasks runned in background"}),(0,s.jsx)(n.td,{children:"-"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"celery-beat"}),(0,s.jsx)(n.td,{children:"Used for linking celery to the backend with django"}),(0,s.jsx)(n.td,{children:"-"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"workers-dashboard"}),(0,s.jsx)(n.td,{children:"A dashboard to see all the celery tasks"}),(0,s.jsxs)(n.td,{children:["Open ",(0,s.jsx)(n.a,{href:"http://localhost:5555",children:"http://localhost:5555"})," in your browser"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"mailpit"}),(0,s.jsx)(n.td,{children:"An email server to show emails sent by django in local"}),(0,s.jsxs)(n.td,{children:["Open ",(0,s.jsx)(n.a,{href:"http://localhost:8025",children:"http://localhost:8025"})," in your browser"]})]})]})]}),"\n",(0,s.jsx)(n.h2,{id:"how-to-run-docker-for-production-server",children:"How to run docker for production server"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["Go to the ",(0,s.jsx)(n.code,{children:"deployment"})," directory."]}),"\n",(0,s.jsxs)(n.li,{children:["Create the environment files at the root of this directory:","\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"backend.env"})," for all environment variables related to django"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"mailu.env"})," for those related to the mail server"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"frontend.env"})," for those related to the react frontend"]}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["Build and run the docker-compose files:","\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d\n"})}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.admonition,{type:"info",children:[(0,s.jsx)(n.p,{children:"Note that in practice, we will not stop and restart all services each\ntime we want to make an update. To do so, we can indicate which service\nwe want to restart. For example, to restart only the backend:"}),(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache nginx backend\ndocker-compose -f docker-compose.yml -f docker-compose.prod.yml up\n"})}),(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"--no-cache"})," option allowed to delete the cache and be sure that\nall files are really updated."]})]})]})}function h(e={}){const{wrapper:n}={...(0,c.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(a,{...e})}):a(e)}},8453:(e,n,r)=>{r.d(n,{R:()=>t,x:()=>d});var o=r(6540);const s={},c=o.createContext(s);function t(e){const n=o.useContext(c);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:t(e.components),o.createElement(c.Provider,{value:n},e.children)}}}]);