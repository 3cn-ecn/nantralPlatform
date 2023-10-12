"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[4e3],{3905:(e,t,a)=>{a.d(t,{Zo:()=>u,kt:()=>h});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),d=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},u=function(e){var t=d(e.components);return n.createElement(s.Provider,{value:t},e.children)},p="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),p=d(a),m=r,h=p["".concat(s,".").concat(m)]||p[m]||c[m]||l;return a?n.createElement(h,o(o({ref:t},u),{},{components:a})):n.createElement(h,o({ref:t},u))}));function h(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,o=new Array(l);o[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i[p]="string"==typeof e?e:r,o[1]=i;for(var d=2;d<l;d++)o[d]=a[d];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},5162:(e,t,a)=>{a.d(t,{Z:()=>o});var n=a(7294),r=a(6010);const l={tabItem:"tabItem_Ymn6"};function o(e){let{children:t,hidden:a,className:o}=e;return n.createElement("div",{role:"tabpanel",className:(0,r.Z)(l.tabItem,o),hidden:a},t)}},4866:(e,t,a)=>{a.d(t,{Z:()=>N});var n=a(7462),r=a(7294),l=a(6010),o=a(2466),i=a(6550),s=a(1980),d=a(7392),u=a(12);function p(e){return function(e){return r.Children.map(e,(e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}(e).map((e=>{let{props:{value:t,label:a,attributes:n,default:r}}=e;return{value:t,label:a,attributes:n,default:r}}))}function c(e){const{values:t,children:a}=e;return(0,r.useMemo)((()=>{const e=t??p(a);return function(e){const t=(0,d.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,a])}function m(e){let{value:t,tabValues:a}=e;return a.some((e=>e.value===t))}function h(e){let{queryString:t=!1,groupId:a}=e;const n=(0,i.k6)(),l=function(e){let{queryString:t=!1,groupId:a}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:t,groupId:a});return[(0,s._X)(l),(0,r.useCallback)((e=>{if(!l)return;const t=new URLSearchParams(n.location.search);t.set(l,e),n.replace({...n.location,search:t.toString()})}),[l,n])]}function f(e){const{defaultValue:t,queryString:a=!1,groupId:n}=e,l=c(e),[o,i]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!m({value:t,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const n=a.find((e=>e.default))??a[0];if(!n)throw new Error("Unexpected error: 0 tabValues");return n.value}({defaultValue:t,tabValues:l}))),[s,d]=h({queryString:a,groupId:n}),[p,f]=function(e){let{groupId:t}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(t),[n,l]=(0,u.Nk)(a);return[n,(0,r.useCallback)((e=>{a&&l.set(e)}),[a,l])]}({groupId:n}),k=(()=>{const e=s??p;return m({value:e,tabValues:l})?e:null})();(0,r.useLayoutEffect)((()=>{k&&i(k)}),[k]);return{selectedValue:o,selectValue:(0,r.useCallback)((e=>{if(!m({value:e,tabValues:l}))throw new Error(`Can't select invalid tab value=${e}`);i(e),d(e),f(e)}),[d,f,l]),tabValues:l}}var k=a(2389);const g={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};function b(e){let{className:t,block:a,selectedValue:i,selectValue:s,tabValues:d}=e;const u=[],{blockElementScrollPositionUntilNextRender:p}=(0,o.o5)(),c=e=>{const t=e.currentTarget,a=u.indexOf(t),n=d[a].value;n!==i&&(p(t),s(n))},m=e=>{let t=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const a=u.indexOf(e.currentTarget)+1;t=u[a]??u[0];break}case"ArrowLeft":{const a=u.indexOf(e.currentTarget)-1;t=u[a]??u[u.length-1];break}}t?.focus()};return r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":a},t)},d.map((e=>{let{value:t,label:a,attributes:o}=e;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:i===t?0:-1,"aria-selected":i===t,key:t,ref:e=>u.push(e),onKeyDown:m,onClick:c},o,{className:(0,l.Z)("tabs__item",g.tabItem,o?.className,{"tabs__item--active":i===t})}),a??t)})))}function v(e){let{lazy:t,children:a,selectedValue:n}=e;const l=(Array.isArray(a)?a:[a]).filter(Boolean);if(t){const e=l.find((e=>e.props.value===n));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return r.createElement("div",{className:"margin-top--md"},l.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==n}))))}function y(e){const t=f(e);return r.createElement("div",{className:(0,l.Z)("tabs-container",g.tabList)},r.createElement(b,(0,n.Z)({},e,t)),r.createElement(v,(0,n.Z)({},e,t)))}function N(e){const t=(0,k.Z)();return r.createElement(y,(0,n.Z)({key:String(t)},e))}},2614:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>u,contentTitle:()=>s,default:()=>h,frontMatter:()=>i,metadata:()=>d,toc:()=>p});var n=a(7462),r=(a(7294),a(3905)),l=a(4866),o=a(5162);const i={sidebar_position:5,last_update:{date:"2023-10-12 17:14:45 +0200",author:"Alexis Delage"}},s="Manage dependencies",d={unversionedId:"dev/advanced-guides/dependencies",id:"dev/advanced-guides/dependencies",title:"Manage dependencies",description:"A little discussion about the nightmare of all developers...",source:"@site/docs/dev/advanced-guides/dependencies.md",sourceDirName:"dev/advanced-guides",slug:"/dev/advanced-guides/dependencies",permalink:"/dev/advanced-guides/dependencies",draft:!1,editUrl:"https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/docs/dev/advanced-guides/dependencies.md",tags:[],version:"current",lastUpdatedBy:"Alexis Delage",lastUpdatedAt:1697123685,formattedLastUpdatedAt:"Oct 12, 2023",sidebarPosition:5,frontMatter:{sidebar_position:5,last_update:{date:"2023-10-12 17:14:45 +0200",author:"Alexis Delage"}},sidebar:"sidebar",previous:{title:"Docker",permalink:"/dev/advanced-guides/docker"},next:{title:"Administrator Guides",permalink:"/dev/admin/"}},u={},p=[{value:"Generalities",id:"generalities",level:2},{value:"Add Dependencies",id:"add-dependencies",level:2},{value:"See outdated dependencies",id:"see-outdated-dependencies",level:2},{value:"Security issues",id:"security-issues",level:2}],c={toc:p},m="wrapper";function h(e){let{components:t,...a}=e;return(0,r.kt)(m,(0,n.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"manage-dependencies"},"Manage dependencies"),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"A little discussion about the nightmare of all developers...")),(0,r.kt)("p",null,"To manage our dependencies, we will use a little program called a ",(0,r.kt)("strong",{parentName:"p"},"package manager"),":\nit will try to find the best dependencies versions for each of our dependency\nto avoid any issue and incompatibility between each library."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"Pipenv"),": a package manager for ",(0,r.kt)("em",{parentName:"li"},"Python"),", used for the Django back end."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"NPM"),": a package manager for ",(0,r.kt)("em",{parentName:"li"},"Node.js"),", used for the React front end and the documentation website.")),(0,r.kt)("h2",{id:"generalities"},"Generalities"),(0,r.kt)("p",null,"For each package manager, there are two files:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"the config file (",(0,r.kt)("inlineCode",{parentName:"li"},"Pipfile")," for pipenv and ",(0,r.kt)("inlineCode",{parentName:"li"},"package.json")," for npm);"),(0,r.kt)("li",{parentName:"ul"},"the lock file (",(0,r.kt)("inlineCode",{parentName:"li"},"Pipfile.lock")," for pipenv and ",(0,r.kt)("inlineCode",{parentName:"li"},"package-lock.json")," for npm).")),(0,r.kt)("p",null,"The config file is used to list the dependencies needed for the project,\nand which versions of each package are required. Then, the package manager\nwill take this config to find all the dependencies and sub-dependencies of each\npackage, and try to find the latest version of each package which is compatible\nwith all the other packages. Once this problem is solved, it will the list of\nall packages and their exact version into the lock file."),(0,r.kt)("h2",{id:"add-dependencies"},"Add Dependencies"),(0,r.kt)(l.Z,{groupId:"package-manager",mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"pipenv",label:"Pipenv",mdxType:"TabItem"},(0,r.kt)("p",null,"Add a dependency:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"pipenv install <package_name>\n")),(0,r.kt)("p",null,"Add a dev dependency (i.e. a package used for devs only):"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"pipenv install --dev <package_name>\n")),(0,r.kt)("p",null,"Remove a dependency:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"pipenv uninstall <package_name>\n"))),(0,r.kt)(o.Z,{value:"npm",label:"NPM",mdxType:"TabItem"},(0,r.kt)("p",null,"Add a dependency:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm install --save <package_name>\n")),(0,r.kt)("p",null,"Add a dev dependency (i.e. a package used for devs only):"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm install --save-dev <package_name>\n")),(0,r.kt)("p",null,"Remove a dependency:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm uninstall <package_name>\n")))),(0,r.kt)("admonition",{type:"danger"},(0,r.kt)("p",{parentName:"admonition"},"Always add the less number of dependencies possible! There are two reasons for this:"),(0,r.kt)("ul",{parentName:"admonition"},(0,r.kt)("li",{parentName:"ul"},"The packages can be ",(0,r.kt)("strong",{parentName:"li"},"not compatible")," between each other"),(0,r.kt)("li",{parentName:"ul"},"For the React front end: the user will download all dependencies when he visits\nthe website, so ",(0,r.kt)("strong",{parentName:"li"},"less dependencies = faster navigation"),"!\n:::")),(0,r.kt)("h2",{parentName:"admonition",id:"update-dependencies"},"Update Dependencies"),(0,r.kt)("p",{parentName:"admonition"},"After you edit the ",(0,r.kt)("strong",{parentName:"p"},"config file"),", or when the last update was too old and you\nneed to update your packages, you have to update the ",(0,r.kt)("strong",{parentName:"p"},"lock file")," with the last\nversions to correct security issues for example.")),(0,r.kt)("p",null,"This command will only update the ",(0,r.kt)("strong",{parentName:"p"},"lock file"),", but not the ",(0,r.kt)("strong",{parentName:"p"},"config file"),":\nif you set an old version of a package in your config\nfile, it will keep the old version to respect the config file.\n:::"),(0,r.kt)(l.Z,{groupId:"package-manager",mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"pipenv",label:"Pipenv",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"pipenv update --dev\n"))),(0,r.kt)(o.Z,{value:"npm",label:"NPM",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm update\n")))),(0,r.kt)("h2",{id:"see-outdated-dependencies"},"See outdated dependencies"),(0,r.kt)("p",null,"Since the ",(0,r.kt)("inlineCode",{parentName:"p"},"update")," command does not really update all the packages, we need\na command to see the outdated packages. The output of the command will tell\nyou if you can update directly a package with an ",(0,r.kt)("inlineCode",{parentName:"p"},"update")," command, or if you\nneed to edit the config file before."),(0,r.kt)(l.Z,{groupId:"package-manager",mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"pipenv",label:"Pipenv",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"pipenv update --outdated\n"))),(0,r.kt)(o.Z,{value:"npm",label:"NPM",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm outdated\n")))),(0,r.kt)("h2",{id:"security-issues"},"Security issues"),(0,r.kt)("p",null,"Sometimes, one of your dependencies has a security issue. In this case,\nyou need to update it as soon as possible to prevent any security issue in your\nproject."),(0,r.kt)("p",null,"There are 3 cases:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"A patch has been released and you can update the package"),": you're fine,\njust do the update!"),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"A patch has been released but you have other dependencies that use this\npackage and they did not update yet"),": wait a little bit that the parent\npackage update its dependencies, and then see case n\xb01. If a package takes\ntoo much time to update its dependencies, then see n\xb03."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"No patch has been released"),": you'll have a lot of work to do, sorry \ud83d\ude22\nYou need to remove this dependency from your project, and try to find\nanother one that can replace the package.")),(0,r.kt)(l.Z,{groupId:"package-manager",mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"pipenv",label:"Pipenv",mdxType:"TabItem"},(0,r.kt)("p",null,"To see all the security issues:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"pipenv check\n"))),(0,r.kt)(o.Z,{value:"npm",label:"NPM",mdxType:"TabItem"},(0,r.kt)("p",null,"To see all the security issues:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm audit\n")))))}h.isMDXComponent=!0}}]);