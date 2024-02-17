"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[6689],{9003:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>p,frontMatter:()=>d,metadata:()=>o,toc:()=>r});var s=t(5893),a=t(1151);const d={sidebar_position:6},i="Dependencies (npm)",o={id:"dev/frontend/dependencies",title:"Dependencies (npm)",description:"A little discussion about the nightmare of all developers...",source:"@site/docs/dev/frontend/dependencies.md",sourceDirName:"dev/frontend",slug:"/dev/frontend/dependencies",permalink:"/dev/frontend/dependencies",draft:!1,unlisted:!1,editUrl:"https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/docs/dev/frontend/dependencies.md",tags:[],version:"current",lastUpdatedBy:"Alexis Delage",lastUpdatedAt:1708213114,formattedLastUpdatedAt:"Feb 17, 2024",sidebarPosition:6,frontMatter:{sidebar_position:6},sidebar:"sidebar",previous:{title:"Integration Tests",permalink:"/dev/frontend/testing/integration-tests"},next:{title:"Debugging",permalink:"/dev/frontend/debugging"}},c={},r=[{value:"Concept",id:"concept",level:2},{value:"Add Dependencies",id:"add-dependencies",level:2},{value:"Update Dependencies",id:"update-dependencies",level:2},{value:"See outdated dependencies",id:"see-outdated-dependencies",level:2},{value:"Security issues",id:"security-issues",level:2}];function l(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,a.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"dependencies-npm",children:"Dependencies (npm)"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.em,{children:"A little discussion about the nightmare of all developers..."})}),"\n",(0,s.jsxs)(n.p,{children:["To manage our dependencies, we use ",(0,s.jsx)(n.a,{href:"https://www.npmjs.com/",children:(0,s.jsx)(n.strong,{children:"npm"})}),".\nNpm is the package manager for JavaScript, and it's used to install and manage\nthe dependencies of a project."]}),"\n",(0,s.jsx)(n.h2,{id:"concept",children:"Concept"}),"\n",(0,s.jsxs)(n.p,{children:["Npm is based on a file named ",(0,s.jsx)(n.code,{children:"package.json"}),". This file is used to list the\ndependencies needed for the project, and which versions of each package are\nrequired. Then, npm will take this config to find all the dependencies and\nsub-dependencies of each package, and try to find the latest version of each\npackage which is compatible with all the other packages. Once this problem is\nsolved, it will the list of all packages and their exact version into the\n",(0,s.jsx)(n.code,{children:"package-lock.json"})," file."]}),"\n",(0,s.jsx)(n.h2,{id:"add-dependencies",children:"Add Dependencies"}),"\n",(0,s.jsx)(n.admonition,{type:"info",children:(0,s.jsxs)(n.p,{children:["You can search for packages on the ",(0,s.jsx)(n.a,{href:"https://www.npmjs.com/",children:"npm website"}),"."]})}),"\n",(0,s.jsxs)(n.p,{children:["Add a dependency (for example ",(0,s.jsx)(n.code,{children:"date-fns"}),"):"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"npm install date-fns\n"})}),"\n",(0,s.jsxs)(n.admonition,{title:"Bundle size",type:"warning",children:[(0,s.jsx)(n.p,{children:"Be careful with the size of the packages you install. Each package installed\nin the frontend will increase the size of the bundle, and so the loading time\nof the website."}),(0,s.jsxs)(n.p,{children:["Always check the size of the package before installing it, for example using\n",(0,s.jsx)(n.a,{href:"https://bundlephobia.com/",children:"Bundlephobia"}),"."]})]}),"\n",(0,s.jsx)(n.p,{children:"Add a dev dependency (i.e. a package used for testing only):"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"npm install --save-dev <package_name>\n"})}),"\n",(0,s.jsx)(n.p,{children:"Remove a dependency:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"npm uninstall <package_name>\n"})}),"\n",(0,s.jsx)(n.admonition,{title:"Semantic Versioning",type:"note",children:(0,s.jsxs)(n.p,{children:["Npm packages use ",(0,s.jsx)(n.a,{href:"https://docs.npmjs.com/about-semantic-versioning",children:"Semantic Versioning"}),"\nto indicate the version of a package."]})}),"\n",(0,s.jsx)(n.h2,{id:"update-dependencies",children:"Update Dependencies"}),"\n",(0,s.jsxs)(n.p,{children:["After you edit the ",(0,s.jsx)(n.strong,{children:"package.json"}),", or when the last update was too old and you\nneed to update your packages, you have to update the ",(0,s.jsx)(n.strong,{children:"lock file"})," with the last\nversions to correct security issues for example."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"npm update\n"})}),"\n",(0,s.jsx)(n.admonition,{type:"warning",children:(0,s.jsxs)(n.p,{children:["This command will only update the ",(0,s.jsx)(n.strong,{children:"lock file"}),", but not always the\n",(0,s.jsx)(n.strong,{children:"package.json"}),": if you set an old version of a package in your package.json,\nit will keep the old version to respect the package.json."]})}),"\n",(0,s.jsx)(n.h2,{id:"see-outdated-dependencies",children:"See outdated dependencies"}),"\n",(0,s.jsxs)(n.p,{children:["Since the ",(0,s.jsx)(n.code,{children:"update"})," command does not really update all the packages, we need\na command to see the outdated packages. The output of the command will tell\nyou if you can update directly a package with an ",(0,s.jsx)(n.code,{children:"update"})," command, or if you\nneed to edit the config file before."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"npm outdated\n"})}),"\n",(0,s.jsx)(n.h2,{id:"security-issues",children:"Security issues"}),"\n",(0,s.jsx)(n.p,{children:"To see all the security issues:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"npm audit\n"})}),"\n",(0,s.jsx)(n.p,{children:"Sometimes, one of your dependencies has a security issue. In this case,\nyou need to update it as soon as possible to prevent any security issue in your\nproject."}),"\n",(0,s.jsx)(n.p,{children:"There are 3 cases:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"A patch has been released and you can update the package"}),": you're fine,\njust do the update!"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"A patch has been released but you have other dependencies that use this\npackage and they did not update yet"}),": wait a little bit that the parent\npackage update its dependencies, and then see case n\xb01. If a package takes\ntoo much time to update its dependencies, then see n\xb03."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"No patch has been released"}),": you'll have a lot of work to do, sorry \ud83d\ude22\nYou need to remove this dependency from your project, and try to find\nanother one that can replace the package."]}),"\n"]})]})}function p(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},1151:(e,n,t)=>{t.d(n,{Z:()=>o,a:()=>i});var s=t(7294);const a={},d=s.createContext(a);function i(e){const n=s.useContext(d);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),s.createElement(d.Provider,{value:n},e.children)}}}]);