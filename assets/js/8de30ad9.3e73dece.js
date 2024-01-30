"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[5719],{3905:(e,t,a)=>{a.d(t,{Zo:()=>u,kt:()=>b});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var p=n.createContext({}),d=function(e){var t=n.useContext(p),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},u=function(e){var t=d(e.components);return n.createElement(p.Provider,{value:t},e.children)},c="mdxType",s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,o=e.originalType,p=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),c=d(a),m=r,b=c["".concat(p,".").concat(m)]||c[m]||s[m]||o;return a?n.createElement(b,i(i({ref:t},u),{},{components:a})):n.createElement(b,i({ref:t},u))}));function b(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=a.length,i=new Array(o);i[0]=m;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l[c]="string"==typeof e?e:r,i[1]=l;for(var d=2;d<o;d++)i[d]=a[d];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},6206:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>s,frontMatter:()=>o,metadata:()=>l,toc:()=>d});var n=a(7462),r=(a(7294),a(3905));const o={title:"Backup the database",description:"Instructions on how to backup the production's database",last_update:{date:"2024-01-30 12:11:39 -0500",author:"Corentin09"}},i="Backups",l={unversionedId:"dev/admin/backup-db",id:"dev/admin/backup-db",title:"Backup the database",description:"Instructions on how to backup the production's database",source:"@site/docs/dev/admin/backup-db.md",sourceDirName:"dev/admin",slug:"/dev/admin/backup-db",permalink:"/dev/admin/backup-db",draft:!1,editUrl:"https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/docs/dev/admin/backup-db.md",tags:[],version:"current",lastUpdatedBy:"Corentin09",lastUpdatedAt:1706634699,formattedLastUpdatedAt:"Jan 30, 2024",frontMatter:{title:"Backup the database",description:"Instructions on how to backup the production's database",last_update:{date:"2024-01-30 12:11:39 -0500",author:"Corentin09"}},sidebar:"sidebar",previous:{title:"Administrator Guides",permalink:"/dev/admin/"},next:{title:"Debugging in production",permalink:"/dev/admin/debugging"}},p={},d=[{value:"Automatic Backups",id:"automatic-backups",level:2},{value:"Create and download a backup",id:"create-and-download-a-backup",level:2},{value:"Upload and use a backup",id:"upload-and-use-a-backup",level:2}],u={toc:d},c="wrapper";function s(e){let{components:t,...a}=e;return(0,r.kt)(c,(0,n.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"backups"},"Backups"),(0,r.kt)("p",null,"This page is about backups of the database on the server. It requires you to have access to the server and already been connected to the ssh terminal."),(0,r.kt)("h2",{id:"automatic-backups"},"Automatic Backups"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Backups of the database are made every day at 05:00 AM and stored on our S3 bucket.")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"They are stored for 30 days. (There is currently nothing to delete them automatically).")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"To make a backup manually: ",(0,r.kt)("inlineCode",{parentName:"p"},"cd /home/ubuntu/nantralPlatform/deployment/scripts && source env/bin/activate && python3 db_backup.py && deactivate"),".")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"A simple restore script is provided. You need to specify some environment variables first:"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre"},"  TARGET_DB: the db name to restore\n  TARGET_ARCHIVE: the full path of the archive to restore\n")),(0,r.kt)("p",{parentName:"li"},"The restore script will delete the TARGET_DB, so make sure you know what you are doing. Then it will create a new one and restore the content from TARGET_ARCHIVE\nIf you specify these environment variable using docker-compose.yml file, then you can execute a restore process like this:\n",(0,r.kt)("inlineCode",{parentName:"p"},"docker-compose exec dbbackup ./restore.sh")))),(0,r.kt)("h2",{id:"create-and-download-a-backup"},"Create and download a backup"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"CD into the development directory with ",(0,r.kt)("inlineCode",{parentName:"li"},"cd nantralPlatform/deployment"),"."),(0,r.kt)("li",{parentName:"ol"},"Dump the database with ",(0,r.kt)("inlineCode",{parentName:"li"},"docker exec deployment_database_1 pg_dump -U userNameDatabase nantral > dump.sql"),".\nThis creates a dump.sql file containing all the database's data."),(0,r.kt)("li",{parentName:"ol"},"In order to download the file, run this command in your terminal ",(0,r.kt)("inlineCode",{parentName:"li"},"scp -i nantral_platform.pem ubuntu@nantral-platform.fr:~/nantralPlatform/deployment/dump.sql ./dump.sql"))),(0,r.kt)("h2",{id:"upload-and-use-a-backup"},"Upload and use a backup"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Transfer the file to the server by running ",(0,r.kt)("inlineCode",{parentName:"li"},"scp -i nantral_platform.pem dump.sql ubuntu@nantral-platform.fr:~/nantralPlatform/deployment/dump.sql"),"."),(0,r.kt)("li",{parentName:"ol"},"Transfer the file to the container with ",(0,r.kt)("inlineCode",{parentName:"li"},"sudo docker cp dump.sql deployment_database_1:dump.sql"),"."),(0,r.kt)("li",{parentName:"ol"},"Open the container's command line with ",(0,r.kt)("inlineCode",{parentName:"li"},"sudo docker exec -it deployment_database_1 bin/sh"),"."),(0,r.kt)("li",{parentName:"ol"},"Restore from the backup with ",(0,r.kt)("inlineCode",{parentName:"li"},"psql -U <username> <dbname> < dump.sql"),".\nNote that username and dbname are available in the .env file in the deployment directory."),(0,r.kt)("li",{parentName:"ol"},"Delete the dump.sql file using ",(0,r.kt)("inlineCode",{parentName:"li"},"rm dump.sql"),"."),(0,r.kt)("li",{parentName:"ol"},"Exit the container by running ",(0,r.kt)("inlineCode",{parentName:"li"},"exit")," and delete the dump again with ",(0,r.kt)("inlineCode",{parentName:"li"},"rm dump.sql"),".")))}s.isMDXComponent=!0}}]);