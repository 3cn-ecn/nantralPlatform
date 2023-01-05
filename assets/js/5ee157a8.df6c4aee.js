"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[7687],{3905:(e,t,a)=>{a.d(t,{Zo:()=>c,kt:()=>h});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),p=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},c=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),u=p(a),m=r,h=u["".concat(s,".").concat(m)]||u[m]||d[m]||o;return a?n.createElement(h,l(l({ref:t},c),{},{components:a})):n.createElement(h,l({ref:t},c))}));function h(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=a.length,l=new Array(o);l[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i[u]="string"==typeof e?e:r,l[1]=i;for(var p=2;p<o;p++)l[p]=a[p];return n.createElement.apply(null,l)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},5162:(e,t,a)=>{a.d(t,{Z:()=>l});var n=a(7294),r=a(6010);const o="tabItem_Ymn6";function l(e){let{children:t,hidden:a,className:l}=e;return n.createElement("div",{role:"tabpanel",className:(0,r.Z)(o,l),hidden:a},t)}},5488:(e,t,a)=>{a.d(t,{Z:()=>m});var n=a(7462),r=a(7294),o=a(6010),l=a(2389),i=a(7392),s=a(7094),p=a(2466);const c="tabList__CuJ",u="tabItem_LNqP";function d(e){const{lazy:t,block:a,defaultValue:l,values:d,groupId:m,className:h}=e,k=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)})),N=d??k.map((e=>{let{props:{value:t,label:a,attributes:n}}=e;return{value:t,label:a,attributes:n}})),b=(0,i.l)(N,((e,t)=>e.value===t.value));if(b.length>0)throw new Error(`Docusaurus error: Duplicate values "${b.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`);const f=null===l?l:l??k.find((e=>e.props.default))?.props.value??k[0].props.value;if(null!==f&&!N.some((e=>e.value===f)))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${f}" but none of its children has the corresponding value. Available values are: ${N.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);const{tabGroupChoices:y,setTabGroupChoices:g}=(0,s.U)(),[v,w]=(0,r.useState)(f),C=[],{blockElementScrollPositionUntilNextRender:T}=(0,p.o5)();if(null!=m){const e=y[m];null!=e&&e!==v&&N.some((t=>t.value===e))&&w(e)}const O=e=>{const t=e.currentTarget,a=C.indexOf(t),n=N[a].value;n!==v&&(T(t),w(n),null!=m&&g(m,String(n)))},j=e=>{let t=null;switch(e.key){case"Enter":O(e);break;case"ArrowRight":{const a=C.indexOf(e.currentTarget)+1;t=C[a]??C[0];break}case"ArrowLeft":{const a=C.indexOf(e.currentTarget)-1;t=C[a]??C[C.length-1];break}}t?.focus()};return r.createElement("div",{className:(0,o.Z)("tabs-container",c)},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":a},h)},N.map((e=>{let{value:t,label:a,attributes:l}=e;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:v===t?0:-1,"aria-selected":v===t,key:t,ref:e=>C.push(e),onKeyDown:j,onClick:O},l,{className:(0,o.Z)("tabs__item",u,l?.className,{"tabs__item--active":v===t})}),a??t)}))),t?(0,r.cloneElement)(k.filter((e=>e.props.value===v))[0],{className:"margin-top--md"}):r.createElement("div",{className:"margin-top--md"},k.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==v})))))}function m(e){const t=(0,l.Z)();return r.createElement(d,(0,n.Z)({key:String(t)},e))}},5894:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>m,frontMatter:()=>i,metadata:()=>p,toc:()=>u});var n=a(7462),r=(a(7294),a(3905)),o=a(5488),l=a(5162);const i={sidebar_position:3},s="Setup the project",p={unversionedId:"dev/get-started/setup-project",id:"dev/get-started/setup-project",title:"Setup the project",description:"Install dependencies",source:"@site/docs/dev/get-started/setup-project.md",sourceDirName:"dev/get-started",slug:"/dev/get-started/setup-project",permalink:"/docs/dev/get-started/setup-project",draft:!1,editUrl:"https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/docs/dev/get-started/setup-project.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"devSidebar",previous:{title:"Confgure your tools",permalink:"/docs/dev/get-started/config-tools"},next:{title:"Begin to code",permalink:"/docs/dev/get-started/begin-code"}},c={},u=[{value:"Install dependencies",id:"install-dependencies",level:2},{value:"Launch the website",id:"launch-the-website",level:2},{value:"Create your account",id:"create-your-account",level:2}],d={toc:u};function m(e){let{components:t,...i}=e;return(0,r.kt)("wrapper",(0,n.Z)({},d,i,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"setup-the-project"},"Setup the project"),(0,r.kt)("h2",{id:"install-dependencies"},"Install dependencies"),(0,r.kt)("p",null,"Open a terminal in the ",(0,r.kt)("inlineCode",{parentName:"p"},"nantralPlatform")," directory (for convenience, you can\nopen this terminal inside of VS Code but it also works if you use your regular\nterminal), and run:"),(0,r.kt)(o.Z,{groupId:"os",mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"win",label:"Windows",mdxType:"TabItem"},(0,r.kt)("p",null,"Run on ",(0,r.kt)("strong",{parentName:"p"},"PowerShell"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"make win-install\n"))),(0,r.kt)(l.Z,{value:"mac-lin",label:"MacOS/Linux",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"make unix-install\n")))),(0,r.kt)("p",null,"That's done! Everything should be installed."),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Help! The ",(0,r.kt)("code",null,"make")," command does not work with me! \ud83d\ude25"),(0,r.kt)("p",null,"Well, sorry you're not lucky! But don't worry, here are all the steps you can do\nto install everything."),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Go into the ",(0,r.kt)("inlineCode",{parentName:"p"},"backend")," directory:"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"cd backend/\n"))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"In the ",(0,r.kt)("inlineCode",{parentName:"p"},"backend/config/settings")," directory, copy the file named ",(0,r.kt)("inlineCode",{parentName:"p"},".env.example"),"\nand rename it ",(0,r.kt)("inlineCode",{parentName:"p"},".env")," only.")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Install dependencies and create a virtuel environment for python:"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"pipenv install --dev\n"))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Create your database for django:"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"pipenv run migrate\n"))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Create an administrator acount on this database:"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"pipenv run createsuperuser\n")),(0,r.kt)("p",{parentName:"li"},"When asked, complete as follow:"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"username: ",(0,r.kt)("inlineCode",{parentName:"li"},"admin")),(0,r.kt)("li",{parentName:"ul"},"email: ",(0,r.kt)("inlineCode",{parentName:"li"},"admin@ec-nantes.fr")),(0,r.kt)("li",{parentName:"ul"},"password: ",(0,r.kt)("inlineCode",{parentName:"li"},"admin")))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Now, change your working directory to the ",(0,r.kt)("inlineCode",{parentName:"p"},"frontend")," one:"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"cd ../frontend\n"))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Install the dependencies:"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm install\n"))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Compile the source code for the first time:"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm run build:dev\n")))),(0,r.kt)("p",null,"Congratulations, you did it all \ud83e\udd73")),(0,r.kt)("h2",{id:"launch-the-website"},"Launch the website"),(0,r.kt)("p",null,"Now it's time to launch the website! To do this:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Go into the backend directory:",(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"cd backend/\n"))),(0,r.kt)("li",{parentName:"ol"},"Launch the backend server (django):",(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"pipenv run start\n"))),(0,r.kt)("li",{parentName:"ol"},"Open this address in your browser: ",(0,r.kt)("a",{parentName:"li",href:"http://localhost:8000"},"http://localhost:8000"))),(0,r.kt)("p",null,"And that's it! You should now see the login page of Nantral Platform:"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"The login page",src:a(6411).Z,width:"1219",height:"653"})),(0,r.kt)("h2",{id:"create-your-account"},"Create your account"),(0,r.kt)("p",null,"The website that you just launched does not use the real database of\nNantral Platform. Instead, for security reasons, an empty database has been\ncreated during the installation process.\nAs a consequence, you have to ",(0,r.kt)("strong",{parentName:"p"},"create an account")," on your ",(0,r.kt)("strong",{parentName:"p"},"local database"),":"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"On the login page, click the ",(0,r.kt)("em",{parentName:"li"},'"Pas de compte ?"')," button, and fill your info\nas you would do on the real website.")),(0,r.kt)("admonition",{title:"Remarks",type:"tip"},(0,r.kt)("ul",{parentName:"admonition"},(0,r.kt)("li",{parentName:"ul"},"Your password will be only stored on your computer: hence, it will not be\nreally protected, so do not use a password similar to your real online\naccounts. You can instead use a dummy password like ",(0,r.kt)("inlineCode",{parentName:"li"},"password"),", as you want!"),(0,r.kt)("li",{parentName:"ul"},"The email will not really be checked, so you can use a dummy one too.\nJust be sure that it finishes with ",(0,r.kt)("inlineCode",{parentName:"li"},"ec-nantes.fr"),"! This allows you to create\nmultiple accounts, to test your code later \ud83d\ude09"))),(0,r.kt)("ol",{start:2},(0,r.kt)("li",{parentName:"ol"},"Once your account is created, the validation email is sent... to the console!\nSo go back to your terminal, and try to find the ",(0,r.kt)("strong",{parentName:"li"},"validation link")," in the\nlogs. Copy and paste this link into your browser, and ",(0,r.kt)("em",{parentName:"li"},"voil\xe0"),", your account\nis validated! ",(0,r.kt)("em",{parentName:"li"},"(You may also need to remove the ",(0,r.kt)("inlineCode",{parentName:"em"},"s")," of ",(0,r.kt)("inlineCode",{parentName:"em"},"https")," in the link to make\nit work, depending of your browser.)"))),(0,r.kt)("ol",{start:3},(0,r.kt)("li",{parentName:"ol"},"Finally, we will make your new account an ",(0,r.kt)("em",{parentName:"li"},"administrator")," account:",(0,r.kt)("ol",{parentName:"li"},(0,r.kt)("li",{parentName:"ol"},"On the local website and ",(0,r.kt)("strong",{parentName:"li"},"log out")," from your account"),(0,r.kt)("li",{parentName:"ol"},"Open ",(0,r.kt)("a",{parentName:"li",href:"http://localhost:8000/admin"},"http://localhost:8000/admin"),", and\nconnect yourself with username and password ",(0,r.kt)("inlineCode",{parentName:"li"},"admin / admin")),(0,r.kt)("li",{parentName:"ol"},"You have now access to the ",(0,r.kt)("em",{parentName:"li"},"Administration Panel of Django"),". In the\n",(0,r.kt)("strong",{parentName:"li"},"Authentification and authorisation")," section, select ",(0,r.kt)("strong",{parentName:"li"},"Users")),(0,r.kt)("li",{parentName:"ol"},"You now have access to the list of all users. Note that some users\nalready exists: they are fake accounts, just there to simulate some students.\n",(0,r.kt)("strong",{parentName:"li"},"Search")," for your account and open it."),(0,r.kt)("li",{parentName:"ol"},"In the ",(0,r.kt)("em",{parentName:"li"},"Permissions")," section, check ",(0,r.kt)("strong",{parentName:"li"},"Staff status")," and\n",(0,r.kt)("strong",{parentName:"li"},"Superuser status")," and then click on the ",(0,r.kt)("strong",{parentName:"li"},"Save")," button."),(0,r.kt)("li",{parentName:"ol"},"That's it! \ud83e\udd73 You are now a superuser, you can ",(0,r.kt)("strong",{parentName:"li"},"log out")," from the admin\naccount, go back to ",(0,r.kt)("a",{parentName:"li",href:"http://localhost:8000"},"http://localhost:8000"),", and log\nin with you own account!")))),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("mdxAdmonitionTitle",{parentName:"admonition"},"Why can I not directly use the ",(0,r.kt)("em",{parentName:"mdxAdmonitionTitle"},"admin")," account?"),(0,r.kt)("p",{parentName:"admonition"},"In facts, on Nantral Platform, we have 2 tables in our database for representing\na user: the first one is called ",(0,r.kt)("inlineCode",{parentName:"p"},"User"),", and the second one ",(0,r.kt)("inlineCode",{parentName:"p"},"Student"),". The\n",(0,r.kt)("inlineCode",{parentName:"p"},"User")," table is made for the authentification and permissions processes, and the\n",(0,r.kt)("inlineCode",{parentName:"p"},"Student")," one is made for the profile of the user."),(0,r.kt)("p",{parentName:"admonition"},"The ",(0,r.kt)("em",{parentName:"p"},"admin")," account is only created during the installation process as an\nelement of the ",(0,r.kt)("inlineCode",{parentName:"p"},"User")," table, and has no equivalent in the ",(0,r.kt)("inlineCode",{parentName:"p"},"Student")," table:\nhence, the ",(0,r.kt)("em",{parentName:"p"},"admin")," account will not really work on Nantral Platform. That's why\nyou need to create your account with the login page, to have both enabled.")))}m.isMDXComponent=!0},6411:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/login-page-22cae92bf3d97d2886180034866d90a4.png"}}]);