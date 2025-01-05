"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[7096],{273:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>o,contentTitle:()=>l,default:()=>h,frontMatter:()=>c,metadata:()=>a,toc:()=>d});const a=JSON.parse('{"id":"dev/server/backup-db","title":"Backup the database","description":"Instructions on how to backup the production\'s database","source":"@site/docs/dev/server/backup-db.mdx","sourceDirName":"dev/server","slug":"/dev/server/backup-db","permalink":"/dev/server/backup-db","draft":false,"unlisted":false,"editUrl":"https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/docs/dev/server/backup-db.mdx","tags":[],"version":"current","lastUpdatedBy":"Alexis Delage","lastUpdatedAt":1719168768000,"frontMatter":{"title":"Backup the database","description":"Instructions on how to backup the production\'s database"},"sidebar":"sidebar","previous":{"title":"Docker","permalink":"/dev/server/docker"},"next":{"title":"Debugging in production","permalink":"/dev/server/debugging"}}');var r=s(4848),t=s(8453);const c={title:"Backup the database",description:"Instructions on how to backup the production's database"},l="Backups",o={},d=[{value:"\ud83d\udd04 Automatic Backups",id:"-automatic-backups",level:2},{value:"\ud83d\udcbe Restore a backup",id:"-restore-a-backup",level:2}];function i(e){const n={a:"a",admonition:"admonition",blockquote:"blockquote",code:"code",em:"em",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,t.R)(),...e.components},{Details:s}=n;return s||function(e,n){throw new Error("Expected "+(n?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"backups",children:"Backups"})}),"\n",(0,r.jsx)(n.p,{children:"This page is about backups of the database on the server. It requires you to have access to the server and already been connected to the ssh terminal."}),"\n",(0,r.jsxs)(n.admonition,{title:"Note",type:"info",children:[(0,r.jsxs)(n.p,{children:["To create backups manually and restore a backup, you'll need to have access to\nthe server. To do so, ",(0,r.jsx)(n.a,{href:"https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent",children:"create a SSH key"}),"\nif you don't have one yet, and send the public key to an admin to add it on the server."]}),(0,r.jsx)(n.p,{children:"Then, you can connect to the server with:"}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"ssh <username>@nantral-platform.fr\n"})}),(0,r.jsx)(n.p,{children:(0,r.jsxs)(n.em,{children:["Ask an admin for the ",(0,r.jsx)(n.code,{children:"<username>"})," of the server's user session."]})})]}),"\n",(0,r.jsx)(n.h2,{id:"-automatic-backups",children:"\ud83d\udd04 Automatic Backups"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Backups are run:","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"each time you push an update to the server (via the deploy_server workflow)"}),"\n",(0,r.jsx)(n.li,{children:"every week on Monday at 05:00 AM"}),"\n",(0,r.jsx)(n.li,{children:"every day at 05:00 AM during September"}),"\n",(0,r.jsx)(n.li,{children:"once a month, a notification is sent to discord to show backups still work"}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.li,{children:"Backups are stored on our S3 bucket on OVH."}),"\n",(0,r.jsx)(n.li,{children:"When a new backup is created, a cleanup is run to keep only the last 20 backups."}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["You can find and download the backups on the OVH platform, in\n",(0,r.jsx)(n.em,{children:"Public Cloud > Object Storage > Backups"}),"."]}),"\n",(0,r.jsxs)(s,{children:[(0,r.jsx)("summary",{children:"Create backups manually"}),(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["Log into the server:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"ssh <username>@nantral-platform.fr\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["CD into the development directory:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"cd nantralPlatform/deployment\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["Create a backup of the database:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"docker exec deployment_database_1 pg_dump -U <db_username> <db_name> > backup.sql\n"})}),"\n",(0,r.jsxs)(n.blockquote,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsxs)(n.em,{children:["You can find ",(0,r.jsx)(n.code,{children:"<db_username>"})," and ",(0,r.jsx)(n.code,{children:"<db_name>"})," in the ",(0,r.jsx)(n.code,{children:"backend.env"})," file. A file named ",(0,r.jsx)(n.code,{children:"backup.sql"})," will then be created in the ",(0,r.jsx)(n.code,{children:"deployment"})," directory."]})}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["Exit from the server:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"exit\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["Copy the backup file from the server to your local computer:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"scp <username>@nantral-platform.fr:~/nantralPlatform/deployment/dump.sql ./dump.sql\n"})}),"\n"]}),"\n"]})]}),"\n",(0,r.jsx)(n.h2,{id:"-restore-a-backup",children:"\ud83d\udcbe Restore a backup"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:"Download the backup on your local computer."}),"\n",(0,r.jsxs)(n.li,{children:["Copy the backup file from your local computer to the server:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"scp backup.sql.gz <username>@nantral-platform.fr:~/nantralPlatform/deployment/backup.sql.gz\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["Log into the server:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"ssh <username>@nantral-platform.fr\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["CD into the deployment directory:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"cd nantralPlatform/deployment\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["Unzip the backup file:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"gunzip backup.sql.gz\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["Copy the backup from the server to the Postgres docker container:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"sudo docker cp backup.sql deployment_database_1:backup.sql\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["Open the container's shell:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"sudo docker exec -it deployment_database_1 bin/sh\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["Replace the current database with the backup:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"psql -U <db_username> <db_name> < backup.sql\n"})}),"\n",(0,r.jsxs)(n.blockquote,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsxs)(n.em,{children:["You can find ",(0,r.jsx)(n.code,{children:"<db_username>"})," and ",(0,r.jsx)(n.code,{children:"<db_name>"})," in the ",(0,r.jsx)(n.code,{children:"backend.env"})," file."]})}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.li,{children:"In your browser, check on the website that the data has been restored correctly \u2705"}),"\n",(0,r.jsxs)(n.li,{children:["Delete the backup.sql file in the container:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"rm backup.sql\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["Exit the container:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"exit\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["Delete the backup.sql file in the server:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"rm backup.sql\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["Exit the server:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"exit\n"})}),"\n"]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(i,{...e})}):i(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>c,x:()=>l});var a=s(6540);const r={},t=a.createContext(r);function c(e){const n=a.useContext(t);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:c(e.components),a.createElement(t.Provider,{value:n},e.children)}}}]);