"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[5362],{3905:function(e,t,r){r.d(t,{Zo:function(){return u},kt:function(){return d}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),p=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),m=p(r),d=a,g=m["".concat(s,".").concat(d)]||m[d]||c[d]||o;return r?n.createElement(g,i(i({ref:t},u),{},{components:r})):n.createElement(g,i({ref:t},u))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var p=2;p<o;p++)i[p]=r[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},7472:function(e,t,r){r.r(t),r.d(t,{assets:function(){return u},contentTitle:function(){return s},default:function(){return d},frontMatter:function(){return l},metadata:function(){return p},toc:function(){return c}});var n=r(7462),a=r(3366),o=(r(7294),r(3905)),i=["components"],l={title:"Staging (or dev) server",description:"How to manage the staging server (available at dev.nantral-platform.fr)",published:!0,date:new Date("2022-04-19T19:36:28.931Z"),editor:"markdown",dateCreated:new Date("2022-04-19T19:35:46.747Z")},s="Staging server",p={unversionedId:"contribute/staging-server",id:"contribute/staging-server",title:"Staging (or dev) server",description:"How to manage the staging server (available at dev.nantral-platform.fr)",source:"@site/docs/contribute/staging-server.md",sourceDirName:"contribute",slug:"/contribute/staging-server",permalink:"/docs/contribute/staging-server",draft:!1,editUrl:"https://github.com/nantral-platform/nantralPlatform/tree/master/docs/docs/contribute/staging-server.md",tags:[],version:"current",frontMatter:{title:"Staging (or dev) server",description:"How to manage the staging server (available at dev.nantral-platform.fr)",published:!0,date:"2022-04-19T19:36:28.931Z",editor:"markdown",dateCreated:"2022-04-19T19:35:46.747Z"},sidebar:"tutorialSidebar",previous:{title:"Guidelines",permalink:"/docs/contribute/guidelines"},next:{title:"Testing your code",permalink:"/docs/contribute/testing"}},u={},c=[{value:"1. Purpose",id:"1-purpose",level:2},{value:"2. How to test my code on the staging server",id:"2-how-to-test-my-code-on-the-staging-server",level:2},{value:"3. How to remove modifications on the staging server",id:"3-how-to-remove-modifications-on-the-staging-server",level:2},{value:"How to reset the staging branch (advanced)",id:"how-to-reset-the-staging-branch-advanced",level:3}],m={toc:c};function d(e){var t=e.components,r=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"staging-server"},"Staging server"),(0,o.kt)("p",null,"Available at ",(0,o.kt)("a",{parentName:"p",href:"https://dev.nantral-platform.fr"},"dev.nantral-platform.fr"),"."),(0,o.kt)("h2",{id:"1-purpose"},"1. Purpose"),(0,o.kt)("p",null,"The purpose of this staging server is to test modifications (and especially database modifications) before adding them to the main server. This is organised that way:"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},"Github branch"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Address"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Purpose"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},"master"),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("a",{parentName:"td",href:"https://www.nantral-platform.fr"},"www.nantral-platform.fr")),(0,o.kt)("td",{parentName:"tr",align:"left"},"The main site for users")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},"staging"),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("a",{parentName:"td",href:"https://dev.nantral-platform.fr"},"dev.nantral-platform.fr")),(0,o.kt)("td",{parentName:"tr",align:"left"},"The dev site for testing")))),(0,o.kt)("h2",{id:"2-how-to-test-my-code-on-the-staging-server"},"2. How to test my code on the staging server"),(0,o.kt)("p",null,"If you want to test your code on the staging server, you just have to create a pull request on Github, and select the branch ",(0,o.kt)("inlineCode",{parentName:"p"},"staging")," instead of ",(0,o.kt)("inlineCode",{parentName:"p"},"master")," to merge in."),(0,o.kt)("p",null,"Then github automatically deploys your code on the staging server, the same way it does for the main server."),(0,o.kt)("p",null,"Note that each time you deploy a new version on the staging server, the database of the staging server is deleted: it is replaced by a ",(0,o.kt)("strong",{parentName:"p"},"copy")," of the ",(0,o.kt)("strong",{parentName:"p"},"database")," from the main server. That way, you can test your modifications to check if your code is compatible with the main server database and will not erased some part of this database."),(0,o.kt)("h2",{id:"3-how-to-remove-modifications-on-the-staging-server"},"3. How to remove modifications on the staging server"),(0,o.kt)("p",null,"Sometimes, you might want to remove the modifications you have pushed on the staging server (but not on the main server). You have two ways to do this:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"Create new commits which revert your previous commits, and merge them on the staging branch"),(0,o.kt)("li",{parentName:"ol"},"If you have way too much commits, you may prefer to reset the staging branch (see below).")),(0,o.kt)("h3",{id:"how-to-reset-the-staging-branch-advanced"},"How to reset the staging branch (advanced)"),(0,o.kt)("p",null,"You have to do it directly on the production server, so please be carefull!"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Connect to the server via ",(0,o.kt)("inlineCode",{parentName:"li"},"ssh")),(0,o.kt)("li",{parentName:"ul"},"Go to the staging directory: ",(0,o.kt)("inlineCode",{parentName:"li"},"cd nantralPlatform-staging/")),(0,o.kt)("li",{parentName:"ul"},"Update the master branch: ",(0,o.kt)("inlineCode",{parentName:"li"},"git checkout master")," then ",(0,o.kt)("inlineCode",{parentName:"li"},"git pull")),(0,o.kt)("li",{parentName:"ul"},"And then reset the staging branch on the server:",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"git checkout staging")," then"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"git reset --hard master"))))),(0,o.kt)("p",null,"Then on your own computer:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Update the master branch: ",(0,o.kt)("inlineCode",{parentName:"li"},"git checkout master")," then ",(0,o.kt)("inlineCode",{parentName:"li"},"git pull")),(0,o.kt)("li",{parentName:"ul"},"And then reset the staging branch again on your computer:",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"git checkout staging")," then"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"git reset --hard master")))),(0,o.kt)("li",{parentName:"ul"},"Finally send the reset operation to the github repository: ",(0,o.kt)("inlineCode",{parentName:"li"},"git push --force")),(0,o.kt)("li",{parentName:"ul"},"Then you can go to see the ",(0,o.kt)("em",{parentName:"li"},"Actions")," page on Github: it should redeploys automatically the staging server")))}d.isMDXComponent=!0}}]);