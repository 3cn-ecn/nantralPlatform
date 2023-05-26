"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[2829],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>h});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),c=p(n),m=r,h=c["".concat(s,".").concat(m)]||c[m]||d[m]||o;return n?a.createElement(h,l(l({ref:t},u),{},{components:n})):a.createElement(h,l({ref:t},u))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,l=new Array(o);l[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i[c]="string"==typeof e?e:r,l[1]=i;for(var p=2;p<o;p++)l[p]=n[p];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5162:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(7294),r=n(6010);const o={tabItem:"tabItem_Ymn6"};function l(e){let{children:t,hidden:n,className:l}=e;return a.createElement("div",{role:"tabpanel",className:(0,r.Z)(o.tabItem,l),hidden:n},t)}},4866:(e,t,n)=>{n.d(t,{Z:()=>N});var a=n(7462),r=n(7294),o=n(6010),l=n(2466),i=n(6550),s=n(1980),p=n(7392),u=n(12);function c(e){return function(e){return r.Children.map(e,(e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}(e).map((e=>{let{props:{value:t,label:n,attributes:a,default:r}}=e;return{value:t,label:n,attributes:a,default:r}}))}function d(e){const{values:t,children:n}=e;return(0,r.useMemo)((()=>{const e=t??c(n);return function(e){const t=(0,p.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function m(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function h(e){let{queryString:t=!1,groupId:n}=e;const a=(0,i.k6)(),o=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,s._X)(o),(0,r.useCallback)((e=>{if(!o)return;const t=new URLSearchParams(a.location.search);t.set(o,e),a.replace({...a.location,search:t.toString()})}),[o,a])]}function y(e){const{defaultValue:t,queryString:n=!1,groupId:a}=e,o=d(e),[l,i]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!m({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const a=n.find((e=>e.default))??n[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:t,tabValues:o}))),[s,p]=h({queryString:n,groupId:a}),[c,y]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[a,o]=(0,u.Nk)(n);return[a,(0,r.useCallback)((e=>{n&&o.set(e)}),[n,o])]}({groupId:a}),k=(()=>{const e=s??c;return m({value:e,tabValues:o})?e:null})();(0,r.useLayoutEffect)((()=>{k&&i(k)}),[k]);return{selectedValue:l,selectValue:(0,r.useCallback)((e=>{if(!m({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);i(e),p(e),y(e)}),[p,y,o]),tabValues:o}}var k=n(2389);const f={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};function b(e){let{className:t,block:n,selectedValue:i,selectValue:s,tabValues:p}=e;const u=[],{blockElementScrollPositionUntilNextRender:c}=(0,l.o5)(),d=e=>{const t=e.currentTarget,n=u.indexOf(t),a=p[n].value;a!==i&&(c(t),s(a))},m=e=>{let t=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const n=u.indexOf(e.currentTarget)+1;t=u[n]??u[0];break}case"ArrowLeft":{const n=u.indexOf(e.currentTarget)-1;t=u[n]??u[u.length-1];break}}t?.focus()};return r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":n},t)},p.map((e=>{let{value:t,label:n,attributes:l}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:i===t?0:-1,"aria-selected":i===t,key:t,ref:e=>u.push(e),onKeyDown:m,onClick:d},l,{className:(0,o.Z)("tabs__item",f.tabItem,l?.className,{"tabs__item--active":i===t})}),n??t)})))}function v(e){let{lazy:t,children:n,selectedValue:a}=e;const o=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=o.find((e=>e.props.value===a));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return r.createElement("div",{className:"margin-top--md"},o.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==a}))))}function g(e){const t=y(e);return r.createElement("div",{className:(0,o.Z)("tabs-container",f.tabList)},r.createElement(b,(0,a.Z)({},e,t)),r.createElement(v,(0,a.Z)({},e,t)))}function N(e){const t=(0,k.Z)();return r.createElement(g,(0,a.Z)({key:String(t)},e))}},4703:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>s,default:()=>h,frontMatter:()=>i,metadata:()=>p,toc:()=>c});var a=n(7462),r=(n(7294),n(3905)),o=n(4866),l=n(5162);const i={sidebar_position:1,description:"Python is an easy-to-learn language used for the server"},s="Python",p={unversionedId:"dev/get-started/install-party/python",id:"dev/get-started/install-party/python",title:"Python",description:"Python is an easy-to-learn language used for the server",source:"@site/docs/dev/get-started/install-party/python.md",sourceDirName:"dev/get-started/install-party",slug:"/dev/get-started/install-party/python",permalink:"/dev/get-started/install-party/python",draft:!1,editUrl:"https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/docs/dev/get-started/install-party/python.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,description:"Python is an easy-to-learn language used for the server"},sidebar:"sidebar",previous:{title:"Install Party",permalink:"/dev/get-started/install-party/"},next:{title:"Node.js",permalink:"/dev/get-started/install-party/node"}},u={},c=[{value:"The Python language",id:"the-python-language",level:2},{value:"Package installer for Python (pip)",id:"package-installer-for-python-pip",level:2},{value:"Pipenv",id:"pipenv",level:2}],d={toc:c},m="wrapper";function h(e){let{components:t,...n}=e;return(0,r.kt)(m,(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"python"},"Python"),(0,r.kt)("p",null,"Let's install Python! Python is a very easy-to-learn language, that we\nused to serve the website. "),(0,r.kt)("iframe",{class:"youtube",src:"https://www.youtube-nocookie.com/embed/x7X9w_GIm1s",title:"YouTube video player",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowfullscreen:!0}),(0,r.kt)("h2",{id:"the-python-language"},"The Python language"),(0,r.kt)("p",null,"For Nantral Platform, we need to install the\n",(0,r.kt)("strong",{parentName:"p"},"Python 3.10")," version. Be sure to select the correct version!! \u26a0\ufe0f"),(0,r.kt)(o.Z,{groupId:"os",mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"win",label:"Windows",mdxType:"TabItem"},(0,r.kt)("p",null,"Download and install Python from the ",(0,r.kt)("strong",{parentName:"p"},(0,r.kt)("a",{parentName:"strong",href:"https://apps.microsoft.com/store/search/python"},"Windows Store")),"."),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"You can also download Python from the ",(0,r.kt)("a",{parentName:"p",href:"https://www.python.org/downloads/"},"official website"),". In this case, be careful\nto check the ",(0,r.kt)("strong",{parentName:"p"},'"Add python to the PATH"')," option during the installation."))),(0,r.kt)(l.Z,{value:"mac",label:"MacOS",mdxType:"TabItem"},(0,r.kt)("p",null,"Download and install Python from the ",(0,r.kt)("a",{parentName:"p",href:"https://www.python.org/downloads/"},"official website"),". Make sure\nto check the ",(0,r.kt)("strong",{parentName:"p"},'"Add python to the PATH"')," option during the installation!"),(0,r.kt)("admonition",{type:"caution"},(0,r.kt)("p",{parentName:"admonition"},"MacOS has already python installed, but sometimes it is the Python2 version. Unfortunately, it is not compatible with Python3,\nso you have to install both versions side by side. If it does not work the first time, you can find tutorials on\nInternet to solve it."))),(0,r.kt)(l.Z,{value:"lin",label:"Linux",mdxType:"TabItem"},(0,r.kt)("p",null,"Python should be already installed on your system, you can check that you have\nthe correct version with:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"python3 --version\n")),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"If Python is not installed, you can run in a terminal:"),(0,r.kt)("pre",{parentName:"blockquote"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"sudo apt update && sudo apt install python3 python3-pip -y\n")),(0,r.kt)("p",{parentName:"blockquote"},"If you don't have the correct version, install ",(0,r.kt)("inlineCode",{parentName:"p"},"pyenv"),":"),(0,r.kt)("pre",{parentName:"blockquote"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"curl https://pyenv.run | bash\n")),(0,r.kt)("p",{parentName:"blockquote"},"(",(0,r.kt)("inlineCode",{parentName:"p"},"pipenv")," will then automatically install the correct version using ",(0,r.kt)("inlineCode",{parentName:"p"},"pyenv"),",\nso don't worry to install the correct python version now.)")))),(0,r.kt)("p",null,"After the installation, check that it works properly:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Open a new terminal"),(0,r.kt)("li",{parentName:"ul"},"Type this command and press ",(0,r.kt)("kbd",null,"ENTER")," to run it:",(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"python3 --version\n"))),(0,r.kt)("li",{parentName:"ul"},"You should see the Python version on a new line: ",(0,r.kt)("inlineCode",{parentName:"li"},"Python 3.xx"))),(0,r.kt)("details",{class:"caution"},(0,r.kt)("summary",null,"The command does not work or the version is not ",(0,r.kt)("em",null,"python3.10"),", what can I do? \ud83d\ude2d"),(0,r.kt)("p",null,"Sometimes you can have multiple versions of python installed on your system: in this case, using ",(0,r.kt)("inlineCode",{parentName:"p"},"python")," can refer to\nanother version of python (for instance, it refers by default to python2 if it is installed). "),(0,r.kt)("p",null,"To avoid this, you can precise which version you want to use by adding the version to the command: try to run\n",(0,r.kt)("inlineCode",{parentName:"p"},"python")," instead of ",(0,r.kt)("inlineCode",{parentName:"p"},"python3"),", to get the correct version, or ",(0,r.kt)("inlineCode",{parentName:"p"},"python3.7")," for example."),(0,r.kt)("p",null,"Also notice that on Windows, ",(0,r.kt)("inlineCode",{parentName:"p"},"python")," is sometimes replaced by ",(0,r.kt)("inlineCode",{parentName:"p"},"py")," only: in this case, you can precise the version\nby runnning ",(0,r.kt)("inlineCode",{parentName:"p"},"py\xa0-3")," for example."),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Once you have found the command that works for you, memorize it: in the following, we will always use ",(0,r.kt)("inlineCode",{parentName:"strong"},"python")," or\n",(0,r.kt)("inlineCode",{parentName:"strong"},"python3")," but you might need to replace it by the command which works for you.")),(0,r.kt)("p",null,"If the command is still not recognized, try to close and reopen your terminal,\nor try to reboot your computer to refresh the available commands.")),(0,r.kt)("h2",{id:"package-installer-for-python-pip"},"Package installer for Python (pip)"),(0,r.kt)("p",null,"Pip should have been installed with Python. To verify this, run:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"python3 -m pip --version\n")),(0,r.kt)("p",null,"It should produce a line like this: ",(0,r.kt)("inlineCode",{parentName:"p"},"pip 20.0.2 from /usr/lib/python3/dist-packages/pip (python 3.10)")),(0,r.kt)("details",null,(0,r.kt)("summary",null,"I have the error ",(0,r.kt)("em",null,'"command pip not found"'),", what can I do?"),(0,r.kt)("p",null,"First, pip is maybe not installed on your system. To install it, run"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"python3 -m ensurepip --upgrade\n")),(0,r.kt)("p",null,"or on Linux:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"sudo apt-get install python3-pip\n")),(0,r.kt)("admonition",{type:"note"},(0,r.kt)("p",{parentName:"admonition"},"Don't forget to replace ",(0,r.kt)("inlineCode",{parentName:"p"},"python")," by ",(0,r.kt)("inlineCode",{parentName:"p"},"python3")," or ",(0,r.kt)("inlineCode",{parentName:"p"},"py")," if needed, as we have seen previsouly."))),(0,r.kt)("p",null,"If you are a more advanced user, you can also add ",(0,r.kt)("inlineCode",{parentName:"p"},"pip")," to your PATH to run\ndirectly ",(0,r.kt)("inlineCode",{parentName:"p"},"pip3")," instead of ",(0,r.kt)("inlineCode",{parentName:"p"},"python3 -m pip"),". In most cases it will be already\nadded to your PATH!"),(0,r.kt)("h2",{id:"pipenv"},"Pipenv"),(0,r.kt)("p",null,"Finally, we will install ",(0,r.kt)("inlineCode",{parentName:"p"},"pipenv")," to replace ",(0,r.kt)("inlineCode",{parentName:"p"},"pip"),". ",(0,r.kt)("em",{parentName:"p"},"But why did you ask me to\nintall ",(0,r.kt)("inlineCode",{parentName:"em"},"pip")," so?"),", you will ask me! Well, the answer is pretty simple: we need\n",(0,r.kt)("inlineCode",{parentName:"p"},"pip")," to install ",(0,r.kt)("inlineCode",{parentName:"p"},"pipenv"),"."),(0,r.kt)(o.Z,{groupId:"os",mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"win",label:"Windows",mdxType:"TabItem"},(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"First, run this command into ",(0,r.kt)("strong",{parentName:"li"},"PowerShell")," to install ",(0,r.kt)("inlineCode",{parentName:"li"},"pipenv"),":",(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-powershell"},"python3 -m pip install --user pipenv\n"))),(0,r.kt)("li",{parentName:"ol"},"Add the ",(0,r.kt)("inlineCode",{parentName:"li"},"pipenv")," command to your PATH:",(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-powershell"},'[Environment]::SetEnvironmentVariable("PATH", $Env:PATH + ";$($(get-item $(python -m site --user-site)).parent.FullName)\\Scripts", [EnvironmentVariableTarget]::User)\n'))),(0,r.kt)("li",{parentName:"ol"},"Close and reopen your terminal to refresh the PATH."),(0,r.kt)("li",{parentName:"ol"},"Finally let's test the installation:",(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"pipenv --version\n"))))),(0,r.kt)(l.Z,{value:"mac-lin",label:"MacOS/Linux",mdxType:"TabItem"},(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"First, run this command to install ",(0,r.kt)("inlineCode",{parentName:"li"},"pipenv"),":",(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"python3 -m pip install --user pipenv\n"))),(0,r.kt)("li",{parentName:"ol"},"Test the installation:",(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"pipenv --version\n"))),(0,r.kt)("li",{parentName:"ol"},"If it does not work, you might need to add ",(0,r.kt)("inlineCode",{parentName:"li"},"pipenv")," to your PATH. To do this,\nyou will edit your profile configuration file ",(0,r.kt)("inlineCode",{parentName:"li"},"~/.bashrc"),", or ",(0,r.kt)("inlineCode",{parentName:"li"},"~/.zshrc"),".\nAt the end of the file, add this line:",(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'export PATH="$PATH:$(python3 -m site --user-base)/bin"\n')),"Close and restart your terminal, and test again to run ",(0,r.kt)("inlineCode",{parentName:"li"},"pipenv"),".\nIf it still doesn't work, replace the previous line by this one:",(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'export PATH="$PATH:$(python3 -m site --user-site)"\n')))))),(0,r.kt)("p",null,"That's it! You finished to install python, congratulations \ud83e\udd73"))}h.isMDXComponent=!0}}]);