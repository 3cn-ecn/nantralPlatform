"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[5016],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return c}});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function r(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,s=e.parentName,u=r(e,["components","mdxType","originalType","parentName"]),m=p(n),c=o,h=m["".concat(s,".").concat(c)]||m[c]||d[c]||i;return n?a.createElement(h,l(l({ref:t},u),{},{components:n})):a.createElement(h,l({ref:t},u))}));function c(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,l=new Array(i);l[0]=m;var r={};for(var s in t)hasOwnProperty.call(t,s)&&(r[s]=t[s]);r.originalType=e,r.mdxType="string"==typeof e?e:o,l[1]=r;for(var p=2;p<i;p++)l[p]=n[p];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},2360:function(e,t,n){n.d(t,{Z:function(){return l}});var a=n(7294),o=n(6010),i="tabItem_OmH5";function l(e){var t=e.children,n=e.hidden,l=e.className;return a.createElement("div",{role:"tabpanel",className:(0,o.Z)(i,l),hidden:n},t)}},9877:function(e,t,n){n.d(t,{Z:function(){return c}});var a=n(7462),o=n(7294),i=n(2389),l=n(7392),r=n(7094),s=n(2466),p=n(6010),u="tabList_uSqn",d="tabItem_LplD";function m(e){var t,n,i,m=e.lazy,c=e.block,h=e.defaultValue,k=e.values,y=e.groupId,v=e.className,f=o.Children.map(e.children,(function(e){if((0,o.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),w=null!=k?k:f.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),N=(0,l.l)(w,(function(e,t){return e.value===t.value}));if(N.length>0)throw new Error('Docusaurus error: Duplicate values "'+N.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var g=null===h?h:null!=(t=null!=h?h:null==(n=f.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(i=f[0])?void 0:i.props.value;if(null!==g&&!w.some((function(e){return e.value===g})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+w.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var b=(0,r.U)(),C=b.tabGroupChoices,T=b.setTabGroupChoices,x=(0,o.useState)(g),I=x[0],O=x[1],P=[],j=(0,s.o5)().blockElementScrollPositionUntilNextRender;if(null!=y){var D=C[y];null!=D&&D!==I&&w.some((function(e){return e.value===D}))&&O(D)}var M=function(e){var t=e.currentTarget,n=P.indexOf(t),a=w[n].value;a!==I&&(j(t),O(a),null!=y&&T(y,a))},Z=function(e){var t,n=null;switch(e.key){case"ArrowRight":var a=P.indexOf(e.currentTarget)+1;n=P[a]||P[0];break;case"ArrowLeft":var o=P.indexOf(e.currentTarget)-1;n=P[o]||P[P.length-1]}null==(t=n)||t.focus()};return o.createElement("div",{className:(0,p.Z)("tabs-container",u)},o.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,p.Z)("tabs",{"tabs--block":c},v)},w.map((function(e){var t=e.value,n=e.label,i=e.attributes;return o.createElement("li",(0,a.Z)({role:"tab",tabIndex:I===t?0:-1,"aria-selected":I===t,key:t,ref:function(e){return P.push(e)},onKeyDown:Z,onFocus:M,onClick:M},i,{className:(0,p.Z)("tabs__item",d,null==i?void 0:i.className,{"tabs__item--active":I===t})}),null!=n?n:t)}))),m?(0,o.cloneElement)(f.filter((function(e){return e.props.value===I}))[0],{className:"margin-top--md"}):o.createElement("div",{className:"margin-top--md"},f.map((function(e,t){return(0,o.cloneElement)(e,{key:t,hidden:e.props.value!==I})}))))}function c(e){var t=(0,i.Z)();return o.createElement(m,(0,a.Z)({key:String(t)},e))}},8657:function(e,t,n){n.r(t),n.d(t,{assets:function(){return m},contentTitle:function(){return u},default:function(){return k},frontMatter:function(){return p},metadata:function(){return d},toc:function(){return c}});var a=n(7462),o=n(3366),i=(n(7294),n(3905)),l=n(9877),r=n(2360),s=["components"],p={title:"Install party",sidebar_position:1},u="Install Party",d={unversionedId:"get-started/install-party",id:"get-started/install-party",title:"Install party",description:"Let's start by installing all the programs we need!",source:"@site/docs/get-started/install-party.md",sourceDirName:"get-started",slug:"/get-started/install-party",permalink:"/docs/get-started/install-party",draft:!1,editUrl:"https://github.com/nantral-platform/nantralPlatform/tree/master/docs/docs/get-started/install-party.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Install party",sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Get Started",permalink:"/docs/category/get-started"},next:{title:"Learning",permalink:"/docs/get-started/learning"}},m={},c=[{value:"Python",id:"python",level:2},{value:"Pip",id:"pip",level:3},{value:"Virtualenv",id:"virtualenv",level:3},{value:"Node.js",id:"nodejs",level:2},{value:"Visual Studio Code",id:"visual-studio-code",level:2},{value:"Git",id:"git",level:2},{value:"Github Desktop",id:"github-desktop",level:2},{value:"Congratulations \ud83e\udd73",id:"congratulations-",level:2}],h={toc:c};function k(e){var t=e.components,n=(0,o.Z)(e,s);return(0,i.kt)("wrapper",(0,a.Z)({},h,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"install-party"},"Install Party"),(0,i.kt)("p",null,"Let's start by installing all the programs we need!"),(0,i.kt)("p",null,"To do this, we will need to use the terminal: make sure that you know how to open it and use it."),(0,i.kt)("details",null,(0,i.kt)("summary",null,"Help! I don't know what a terminal is \ud83d\ude22"),"Don't worry, we will explain you the basics \ud83d\ude09",(0,i.kt)(l.Z,{groupId:"os",mdxType:"Tabs"},(0,i.kt)(r.Z,{value:"win",label:"Windows",mdxType:"TabItem"},(0,i.kt)("p",null,"On Windows, you have two terminals: ",(0,i.kt)("inlineCode",{parentName:"p"},"CMD"),", the oldest one, and ",(0,i.kt)("inlineCode",{parentName:"p"},"Powershell"),", the new one. We recommend you to\nuse Powershell."),(0,i.kt)("p",null,"To open a terminal, simply type ",(0,i.kt)("inlineCode",{parentName:"p"},"Powershell")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"CMD")," in the search bar of your system, and open it like any\napplication. There you are! A new window with some white lines should appear."),(0,i.kt)("p",null,"The directory where you are is shown on the last line. By default, it should be your user directory, so\nsomething like ",(0,i.kt)("inlineCode",{parentName:"p"},"C:\\Users\\michel\\"),". You can deplace to other directories with:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},'cd ".\\my_subdirectory\\"'),": go into the subdirectory ",(0,i.kt)("inlineCode",{parentName:"li"},"my_subdirectory")," (try with the default directory\n",(0,i.kt)("inlineCode",{parentName:"li"},"Downloads")," !). The ",(0,i.kt)("inlineCode",{parentName:"li"},".")," in this command represents the current directory. Note that the ",(0,i.kt)("inlineCode",{parentName:"li"},'"')," are optionals\n(they are required only if your path contains spaces)."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"cd .."),": go to the parent directory"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"ls"),": list all the files and sub-directories of the current directory"))),(0,i.kt)(r.Z,{value:"mac",label:"MacOS",mdxType:"TabItem"},(0,i.kt)("p",null,"Open Spotlight, and type ",(0,i.kt)("inlineCode",{parentName:"p"},"terminal"),". Then you can launch the ",(0,i.kt)("inlineCode",{parentName:"p"},"terminal.app")," application, and voil\xe0!\nBy default, you are in your home directory. You can deplace to other directories with:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},'cd "./my_subdirectory/"'),": go into the subdirectory ",(0,i.kt)("inlineCode",{parentName:"li"},"my_subdirectory"),". The ",(0,i.kt)("inlineCode",{parentName:"li"},".")," in this command represents the\ncurrent directory. Note that the ",(0,i.kt)("inlineCode",{parentName:"li"},'"')," are optionals (they are required only if your path contains spaces)."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"cd .."),": go to the parent directory"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"ls"),": list all the files and sub-directories of the current directory"))),(0,i.kt)(r.Z,{value:"lin",label:"Linux",mdxType:"TabItem"},(0,i.kt)("p",null,'The name of your terminal depends on your distribution. For example, it is "Terminal" for Ubuntu, or "Konsole"\nfor Kubuntu.\nBy default, you are in your home directory. You can deplace to other directories with:'),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},'cd "./my_subdirectory/"'),": go into the subdirectory ",(0,i.kt)("inlineCode",{parentName:"li"},"my_subdirectory"),". The ",(0,i.kt)("inlineCode",{parentName:"li"},".")," in this command represents the\ncurrent directory. Note that the ",(0,i.kt)("inlineCode",{parentName:"li"},'"')," are optionals (they are required only if your path contains spaces)."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"cd .."),": go to the parent directory"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"ls"),": list all the files and sub-directories of the current directory"))))),(0,i.kt)("h2",{id:"python"},"Python"),(0,i.kt)("p",null,"Python is the program corresponding to the famous language. We recommend to use Python ",(0,i.kt)("inlineCode",{parentName:"p"},"3.10")," since it is the latest\nstable version, but you can use other versions (minimum ",(0,i.kt)("inlineCode",{parentName:"p"},"3.7"),")."),(0,i.kt)(l.Z,{groupId:"os",mdxType:"Tabs"},(0,i.kt)(r.Z,{value:"win",label:"Windows",mdxType:"TabItem"},(0,i.kt)("p",null,"Download and install Python from the ",(0,i.kt)("a",{parentName:"p",href:"https://www.microsoft.com/store/productId/9PJPW5LDXLZ5"},"Windows Store"),"."),(0,i.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"You can also download Python from the ",(0,i.kt)("a",{parentName:"p",href:"https://www.python.org/downloads/"},"official website"),". In this case, be careful\nto check the ",(0,i.kt)("strong",{parentName:"p"},'"Add python to the PATH"')," option during the installation.")))),(0,i.kt)(r.Z,{value:"mac",label:"MacOS",mdxType:"TabItem"},(0,i.kt)("p",null,"Download and install Python from the ",(0,i.kt)("a",{parentName:"p",href:"https://www.python.org/downloads/"},"official website"),". Make sure\nto check the ",(0,i.kt)("strong",{parentName:"p"},'"Add python to the PATH"')," option during the installation!"),(0,i.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"caution")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"MacOS has already python installed, but the Python 2 version. Unfortunately, it is not compatible with Python 3,\nso you have to install both versions side by side. If it does not work the first time, you can find tutorials on\nInternet to solve it.")))),(0,i.kt)(r.Z,{value:"lin",label:"Linux",mdxType:"TabItem"},(0,i.kt)("p",null,"Open a terminal and run"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"sudo apt update && sudo apt install python3 python3-pip -y\n")),(0,i.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"caution")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"Some Linux distributions come with ",(0,i.kt)("inlineCode",{parentName:"p"},"Python")," already installed. In this case, try to check your python version:\nif your version is belowed ",(0,i.kt)("inlineCode",{parentName:"p"},"3.7"),", you might need to upgrade your distribution."))))),(0,i.kt)("p",null,"After the installation, check that it works properly:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Open a new terminal"),(0,i.kt)("li",{parentName:"ul"},"Type the command ",(0,i.kt)("inlineCode",{parentName:"li"},"python --version")," and press ",(0,i.kt)("kbd",null,"ENTER")," to run it."),(0,i.kt)("li",{parentName:"ul"},"You should see the Python version on a new line: ",(0,i.kt)("inlineCode",{parentName:"li"},"Python 3.10"))),(0,i.kt)("details",null,(0,i.kt)("summary",null,"The command does not work or the version is incorrect, what can I do?"),(0,i.kt)("p",null,"Sometimes you can have multiple versions of python installed on your system: in this case, using ",(0,i.kt)("inlineCode",{parentName:"p"},"python")," can refer to\nanother version of python (for instance, it refers by default to python2 if it is installed). "),(0,i.kt)("p",null,"To avoid this, you can precise which version you want to use by adding the version to the command: try to run\n",(0,i.kt)("inlineCode",{parentName:"p"},"python3\xa0--version")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"python3.10\xa0--version")," for example, to get the correct version."),(0,i.kt)("p",null,"Also notice that on Windows, ",(0,i.kt)("inlineCode",{parentName:"p"},"python")," is sometimes replaced by ",(0,i.kt)("inlineCode",{parentName:"p"},"py")," only: in this case, you can precise the version\nby runnning ",(0,i.kt)("inlineCode",{parentName:"p"},"py\xa0-3")," for example."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Once you have found the command that works for you, memorize it: in the following, we will always use ",(0,i.kt)("inlineCode",{parentName:"strong"},"python")," or\n",(0,i.kt)("inlineCode",{parentName:"strong"},"python3")," but you might need to replace it by the versionned command that works for you."))),(0,i.kt)("h3",{id:"pip"},"Pip"),(0,i.kt)("p",null,"Pip should have been installed with Python. To verify this, run ",(0,i.kt)("inlineCode",{parentName:"p"},"pip --version"),". It should produce a line like this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"pip 20.0.2 from /usr/lib/python3/dist-packages/pip (python 3.10)\n")),(0,i.kt)("p",null,"Check that the python version indicated at the end of the line is correct. If not, you can try to run ",(0,i.kt)("inlineCode",{parentName:"p"},"pip3")," instead\nto force pip to use python3."),(0,i.kt)("details",null,(0,i.kt)("summary",null,"I have the error ",(0,i.kt)("em",null,'"command pip not found"'),", what can I do?"),(0,i.kt)("p",null,"First, pip is maybe not installed on your system. To install it, run"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"python -m ensurepip --upgrade\n")),(0,i.kt)("p",null,"Then, you should get pip through this command:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"python -m pip --version\n")),(0,i.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"Don't forget to replace ",(0,i.kt)("inlineCode",{parentName:"p"},"python")," by ",(0,i.kt)("inlineCode",{parentName:"p"},"python3")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"py")," if needed, as we have seen previsouly."))),(0,i.kt)("p",null,"Finally, try to launch the pip command directly: "),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"pip --version\n")),(0,i.kt)("p",null,"If this last command does not work, that means that pip is not installed in your PATH. You can easily find\nhow to install it by a search, or you can replace ",(0,i.kt)("inlineCode",{parentName:"p"},"pip")," by ",(0,i.kt)("inlineCode",{parentName:"p"},"python -m pip")," if it does not bother you.")),(0,i.kt)("h3",{id:"virtualenv"},"Virtualenv"),(0,i.kt)("p",null,"Finally we will install the virtualenv module. This module allows us to to install all dependencies for a project in\na python virtual environment so as to not have conflicts between the dependencies of multiple projects."),(0,i.kt)("p",null,"Install it by running:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"pip install virtualenv\n")),(0,i.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"If you used ",(0,i.kt)("inlineCode",{parentName:"p"},"pip3")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"python -m pip")," instead of ",(0,i.kt)("inlineCode",{parentName:"p"},"pip")," in the previous section, make sure to replace it again for this\ncommand. In the following, we will only use ",(0,i.kt)("inlineCode",{parentName:"p"},"pip")," for simplicity, but you still have to replace it each time we use it."))),(0,i.kt)("p",null,"That's it! You finished to install python, congratulations \ud83e\udd73"),(0,i.kt)("details",null,(0,i.kt)("summary",null,"Discover Python in 100s \ud83c\udfac"),(0,i.kt)("iframe",{class:"youtube",src:"https://www.youtube-nocookie.com/embed/x7X9w_GIm1s",title:"YouTube video player",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowfullscreen:!0})),(0,i.kt)("h2",{id:"nodejs"},"Node.js"),(0,i.kt)("p",null,'We recommend you to use the latest stable version of Node (also called the "LTS" version). Currently, it is the\n16.15.0 version.'),(0,i.kt)(l.Z,{groupId:"os",mdxType:"Tabs"},(0,i.kt)(r.Z,{value:"win-mac",label:"Windows/MacOS",mdxType:"TabItem"},(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Download ",(0,i.kt)("strong",{parentName:"li"},"Node.js LTS")," from ",(0,i.kt)("a",{parentName:"li",href:"https://nodejs.org/en/"},"the official website"),"."),(0,i.kt)("li",{parentName:"ul"},"Install Node.js by clicking on the executable you just downloaded."))),(0,i.kt)(r.Z,{value:"lin",label:"Linux",mdxType:"TabItem"},(0,i.kt)("p",null,"Open a terminal and run"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"sudo apt update && sudo apt install nodejs npm -y\n")),(0,i.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"You might need in the future to have different versions of node.js installed for different projects. To manage them,\nyou can check the ",(0,i.kt)("inlineCode",{parentName:"p"},"nvm")," package which allowed you to have multiple versions of node.js."))))),(0,i.kt)("p",null,"Check that the installtion was successful: "),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Open a terminal and run ",(0,i.kt)("inlineCode",{parentName:"li"},"node -v"),", and then ",(0,i.kt)("inlineCode",{parentName:"li"},"npm -v"),". "),(0,i.kt)("li",{parentName:"ul"},"You should get a version number for each command. If you get an error such as ",(0,i.kt)("inlineCode",{parentName:"li"},"command not found"),", the\ninstallation did not work. You can also have to restart your computer to make it work.")),(0,i.kt)("p",null,"As you saw, node.js comes with two different commands:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"node")," is the programming language itself, which allow us to run scripts in javascript"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"npm")," is the ",(0,i.kt)("strong",{parentName:"li"},"n"),"ode ",(0,i.kt)("strong",{parentName:"li"},"p"),"ackage ",(0,i.kt)("strong",{parentName:"li"},"m"),"anager, which we will use to install dependencies")),(0,i.kt)("details",null,(0,i.kt)("summary",null,"Discover Nodejs in 15min \ud83c\udfac"),(0,i.kt)("iframe",{class:"youtube",src:"https://www.youtube-nocookie.com/embed/ENrzD9HAZK4",title:"YouTube video player",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowfullscreen:!0})),(0,i.kt)("h2",{id:"visual-studio-code"},"Visual Studio Code"),(0,i.kt)("p",null,"You can use whatever IDE suites you the best, however, we strongly encourage you to use Visual Studio Code as we have\ncreated vscode configuration files to make sure everybody follow the same code style."),(0,i.kt)(l.Z,{groupId:"os",mdxType:"Tabs"},(0,i.kt)(r.Z,{value:"win-mac",label:"Windows/MacOS",mdxType:"TabItem"},(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Download the latest release of VSCode from the ",(0,i.kt)("a",{parentName:"li",href:"https://code.visualstudio.com/"},"official website"),". "),(0,i.kt)("li",{parentName:"ul"},"Click on the executable you've just downloaded and follow the instructions."))),(0,i.kt)(r.Z,{value:"lin",label:"Linux",mdxType:"TabItem"},(0,i.kt)("p",null,"Install the snap package:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"sudo snap install code --classic\n")),(0,i.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"If you prefere, Visual Studio Code is also available as a\n",(0,i.kt)("a",{parentName:"p",href:"https://flathub.org/apps/details/com.visualstudio.code"},"flatpak package"),"."))))),(0,i.kt)("details",null,(0,i.kt)("summary",null,"Discover VS Code in 100s \ud83c\udfac"),(0,i.kt)("iframe",{class:"youtube",src:"https://www.youtube-nocookie.com/embed/KMxo3T_MTvY",title:"YouTube video player",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowfullscreen:!0})),(0,i.kt)("h2",{id:"git"},"Git"),(0,i.kt)(l.Z,{groupId:"os",mdxType:"Tabs"},(0,i.kt)(r.Z,{value:"win-mac",label:"Windows/MacOS",mdxType:"TabItem"},(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Download ",(0,i.kt)("inlineCode",{parentName:"li"},"git")," from ",(0,i.kt)("a",{parentName:"li",href:"https://git-scm.com/download"},"the official website"),"."),(0,i.kt)("li",{parentName:"ul"},"Install ",(0,i.kt)("inlineCode",{parentName:"li"},"git")," by clicking on the executable you've just downloaded."),(0,i.kt)("li",{parentName:"ul"},"During the installation, just click ",(0,i.kt)("inlineCode",{parentName:"li"},"OK")," for all the steps as we don't need to use the advanced options,\nunless you know what you are doing."))),(0,i.kt)(r.Z,{value:"lin",label:"Linux",mdxType:"TabItem"},(0,i.kt)("p",null,"Open a terminal and run:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"sudo apt update && sudo apt install git -y\n")))),(0,i.kt)("p",null,"To make sure that the installation was successful, open a terminal window and run ",(0,i.kt)("inlineCode",{parentName:"p"},"git -v"),".\nYou should get a version number as an output. If you get an error such as ",(0,i.kt)("inlineCode",{parentName:"p"},"command not found"),",\nthe installation did not work. You can also have to restart your computer to make it work."),(0,i.kt)("details",null,(0,i.kt)("summary",null,"Discover Git in 100s \ud83c\udfac"),(0,i.kt)("iframe",{class:"youtube",src:"https://www.youtube-nocookie.com/embed/hwP7WQkmECE",title:"YouTube video player",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowfullscreen:!0})),(0,i.kt)("h2",{id:"github-desktop"},"Github Desktop"),(0,i.kt)("p",null,"If you're not totally fluent whit the Git command-line interface, you can use Github Desktop for easily use git\ncommands with a graphical interface."),(0,i.kt)(l.Z,{groupId:"os",mdxType:"Tabs"},(0,i.kt)(r.Z,{value:"win-mac",label:"Windows/MacOS",mdxType:"TabItem"},(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Download the software on the official website : ",(0,i.kt)("a",{parentName:"li",href:"https://desktop.github.com/"},"desktop.github.com")),(0,i.kt)("li",{parentName:"ul"},"Install it and connect it to your Github Account."),(0,i.kt)("li",{parentName:"ul"},"You're done!"))),(0,i.kt)(r.Z,{value:"lin",label:"Linux",mdxType:"TabItem"},(0,i.kt)("p",null,"Sorry, there is no official package of Github Desktop for Linux. \ud83d\ude22\nYou can use the other options below instead, or use the unofficial package for linux\n(",(0,i.kt)("a",{parentName:"p",href:"https://gist.github.com/berkorbay/6feda478a00b0432d13f1fc0a50467f1"},"follow the instructions here"),")."))),(0,i.kt)("div",{className:"admonition admonition-success alert alert--success"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Other Git Interfaces")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"If you already know git, you can also use the git manager in VS Code. However we strongly recommend to enrich it\nby installing the ",(0,i.kt)("a",{parentName:"p",href:"https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens"},"GitLens")," extension!"))),(0,i.kt)("h2",{id:"congratulations-"},"Congratulations \ud83e\udd73"),(0,i.kt)("p",null,"You installed all the programs! Now let's try some exercices and tutorials so as to learn the different concepts\nof the Nantral Platform project."))}k.isMDXComponent=!0}}]);