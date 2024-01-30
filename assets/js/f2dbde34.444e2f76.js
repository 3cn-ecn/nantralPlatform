"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[7653],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=r.createContext({}),s=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=s(e.components);return r.createElement(u.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},h=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,u=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),p=s(n),h=a,m=p["".concat(u,".").concat(h)]||p[h]||d[h]||o;return n?r.createElement(m,i(i({ref:t},c),{},{components:n})):r.createElement(m,i({ref:t},c))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=h;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l[p]="string"==typeof e?e:a,i[1]=l;for(var s=2;s<o;s++)i[s]=n[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}h.displayName="MDXCreateElement"},9387:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>l,toc:()=>s});var r=n(7462),a=(n(7294),n(3905));const o={sidebar_position:1,description:"An easy tutorial for beginners with Git",last_update:{date:"2024-01-30 12:11:39 -0500",author:"Corentin09"}},i="Tutorial for GitHub Desktop",l={unversionedId:"dev/guides/git/tutorial",id:"dev/guides/git/tutorial",title:"Tutorial for GitHub Desktop",description:"An easy tutorial for beginners with Git",source:"@site/docs/dev/guides/git/tutorial.md",sourceDirName:"dev/guides/git",slug:"/dev/guides/git/tutorial",permalink:"/dev/guides/git/tutorial",draft:!1,editUrl:"https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/docs/dev/guides/git/tutorial.md",tags:[],version:"current",lastUpdatedBy:"Corentin09",lastUpdatedAt:1706634699,formattedLastUpdatedAt:"Jan 30, 2024",sidebarPosition:1,frontMatter:{sidebar_position:1,description:"An easy tutorial for beginners with Git",last_update:{date:"2024-01-30 12:11:39 -0500",author:"Corentin09"}},sidebar:"sidebar",previous:{title:"Git",permalink:"/dev/guides/git/"},next:{title:"Daily workflow",permalink:"/dev/guides/git/daily-workflow"}},u={},s=[{value:"Presentation",id:"presentation",level:2},{value:"Make your first commit",id:"make-your-first-commit",level:2},{value:"1. Create a new branch",id:"1-create-a-new-branch",level:3},{value:"2. Make your changes",id:"2-make-your-changes",level:3},{value:"3. Publish your changes",id:"3-publish-your-changes",level:3}],c={toc:s},p="wrapper";function d(e){let{components:t,...o}=e;return(0,a.kt)(p,(0,r.Z)({},c,o,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"tutorial-for-github-desktop"},"Tutorial for GitHub Desktop"),(0,a.kt)("p",null,"Let's learn git and github by a simple example: you will try to add your\nname on the README.md page of the github project."),(0,a.kt)("h2",{id:"presentation"},"Presentation"),(0,a.kt)("iframe",{class:"youtube",src:"https://www.youtube-nocookie.com/embed/hwP7WQkmECE",title:"YouTube video player",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowfullscreen:!0}),(0,a.kt)("h2",{id:"make-your-first-commit"},"Make your first commit"),(0,a.kt)("p",null,"It's time to make your first commit! This page explains how to do it with Github\nDesktop, for beginners. If you use another git interface or the git cli, we\nsuppose that you are able to transpose the actions with your git interface."),(0,a.kt)("h3",{id:"1-create-a-new-branch"},"1. Create a new branch"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"In Github Desktop, create a new branch from ",(0,a.kt)("inlineCode",{parentName:"li"},"master"),", and give it a name.")),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Create new branch",src:n(2832).Z,width:"1144",height:"496"})),(0,a.kt)("admonition",{type:"info"},(0,a.kt)("p",{parentName:"admonition"},"We recommand you to create a new branch before writing new changes to the code. Indeed, the default selected branch\nis ",(0,a.kt)("inlineCode",{parentName:"p"},"master"),", which is the branch directly linked to the server. This branch is therefore protected, so you cannot\npush changes on it.")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Then publish your new branch to Github:")),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Publish a branch",src:n(8307).Z,width:"1444",height:"132"})),(0,a.kt)("admonition",{type:"info"},(0,a.kt)("p",{parentName:"admonition"},"If you cannot publish the branch, that means that you do not have the right to write on the repository.\nYou can ask one of the administators of the repository (for example the president of the club) to grant you\nthis access by adding you to the nantral-platform organization.")),(0,a.kt)("h3",{id:"2-make-your-changes"},"2. Make your changes"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"In VS Code, open the ",(0,a.kt)("inlineCode",{parentName:"li"},"README.md")," file in the main directory."),(0,a.kt)("li",{parentName:"ul"},"Add your name and a link to your github account under the ",(0,a.kt)("inlineCode",{parentName:"li"},"Contributors")," section, at the end of the file"),(0,a.kt)("li",{parentName:"ul"},"Save the file")),(0,a.kt)("h3",{id:"3-publish-your-changes"},"3. Publish your changes"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Now go back to Github Desktop, give a name to the commit and create it:")),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Create commit",src:n(2007).Z,width:"404",height:"950"})),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Then push your commit on the github server:")),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Push a commit",src:n(8941).Z,width:"1246",height:"276"})),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Finally create a pull request:")),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Create pull request",src:n(5642).Z,width:"1214",height:"252"})),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"Now the github website should open in your browser. Click the ",(0,a.kt)("em",{parentName:"p"},'"Create pull request"')," button, and then\n",(0,a.kt)("em",{parentName:"p"},'"Merge pull request"'),".")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"Congratulations, you're done! \ud83e\udd73 You can now see your name on the home page of the repository:\n",(0,a.kt)("a",{parentName:"p",href:"https://github.com/3cn-ecn/nantralPlatform"},"github.com/3cn-ecn/nantralPlatform")))))}d.isMDXComponent=!0},2007:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/commit-button-c74b81664ec942e4328c58912cee55db.png"},5642:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/create-pull-request-9cba584c711a2ee9dd2df378f16c70d5.png"},2832:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/new-branch-button-win-79c1c09d1f06025954ace3514642a0cf.png"},8307:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/publish-branch-button-02492e15a15e2c1b458a05aa60a2f1c1.png"},8941:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/push-origin-button-488d9844581e07b7f218e62cf9c144ef.png"}}]);