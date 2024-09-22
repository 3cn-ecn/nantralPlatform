"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[4565],{6480:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>p,frontMatter:()=>i,metadata:()=>d,toc:()=>u});var a=t(4848),s=t(8453),r=t(9365),l=t(1470);const i={title:"Translations (i18n)",sidebar_position:4,description:"Translations and Internationalisation"},o="Translations (i18n) in Django",d={id:"dev/backend/i18n",title:"Translations (i18n)",description:"Translations and Internationalisation",source:"@site/docs/dev/backend/i18n.mdx",sourceDirName:"dev/backend",slug:"/dev/backend/i18n",permalink:"/dev/backend/i18n",draft:!1,unlisted:!1,editUrl:"https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/docs/dev/backend/i18n.mdx",tags:[],version:"current",lastUpdatedBy:"Alexis Delage",lastUpdatedAt:1712699007e3,sidebarPosition:4,frontMatter:{title:"Translations (i18n)",sidebar_position:4,description:"Translations and Internationalisation"},sidebar:"sidebar",previous:{title:"Manage URLs",permalink:"/dev/backend/create-an-app/urls"},next:{title:"Testing",permalink:"/dev/backend/testing/"}},c={},u=[{value:"Translating texts",id:"translating-texts",level:2},{value:"1. Use the <code>gettext</code> method for all texts",id:"1-use-the-gettext-method-for-all-texts",level:3},{value:"2. Write the Translations",id:"2-write-the-translations",level:3},{value:"3. Compile the translations",id:"3-compile-the-translations",level:3},{value:"Translating dates",id:"translating-dates",level:2},{value:"Adding a new language",id:"adding-a-new-language",level:2}];function h(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.R)(),...e.components},{Details:t}=n;return t||function(e,n){throw new Error("Expected "+(n?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.header,{children:(0,a.jsx)(n.h1,{id:"translations-i18n-in-django",children:"Translations (i18n) in Django"})}),"\n",(0,a.jsx)(n.p,{children:"Internationalisation (or i18n for short) is the concept of adapting a website\nfor another country, language or culture. It regroups the translations of text,\nbut also the format of dates and hours for example."}),"\n",(0,a.jsx)(n.h2,{id:"translating-texts",children:"Translating texts"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://docs.djangoproject.com/en/4.1/topics/i18n/translation/",children:"Django Documentation on Text Translation"})}),"\n"]}),"\n",(0,a.jsxs)(n.h3,{id:"1-use-the-gettext-method-for-all-texts",children:["1. Use the ",(0,a.jsx)(n.code,{children:"gettext"})," method for all texts"]}),"\n",(0,a.jsxs)(n.p,{children:["In your code, use the ",(0,a.jsx)(n.code,{children:"gettext"})," method to signal to django that the text should\nbe translated:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-python",children:'from django.utils.translation import gettext as _\n\ndef my_view(request):\n    output = (\n      _("Welcome on Nantral Platform %(name)s!")\n      % {\'name\': request.user.first_name}\n    )\n    return HttpResponse(output)\n\n# returns "Welcome on Nantral Platform John!"\n'})}),"\n",(0,a.jsxs)(n.p,{children:["For texts that are ",(0,a.jsx)(n.strong,{children:"NOT inside a function"}),", you must use\n",(0,a.jsx)(n.code,{children:"gettext_lazy"})," instead of ",(0,a.jsx)(n.code,{children:"gettext"}),":"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-python",children:'# use gettext_lazy instead of gettext!\nfrom django.utils.translation import gettext_lazy as _\n\nclass Group(models.Model):\n    name = models.CharField(_("Group Name"))\n'})}),"\n",(0,a.jsx)(n.admonition,{title:"Conventions",type:"info",children:(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["In your code, write texts in ",(0,a.jsx)(n.strong,{children:"English"})]}),"\n",(0,a.jsxs)(n.li,{children:["For other languages, like ",(0,a.jsx)(n.strong,{children:"French"}),", write the translations in the ",(0,a.jsx)(n.code,{children:".po"})," files\n(see the following section)"]}),"\n"]})}),"\n",(0,a.jsx)(n.h3,{id:"2-write-the-translations",children:"2. Write the Translations"}),"\n",(0,a.jsxs)(t,{children:[(0,a.jsxs)("summary",{children:["First run: install ",(0,a.jsx)("code",{children:"gettext"}),"!!!"]}),(0,a.jsxs)(n.p,{children:["To use the django commands for translations, you have to install the ",(0,a.jsx)(n.code,{children:"gettext"})," program."]}),(0,a.jsxs)(l.A,{groupId:"os",children:[(0,a.jsx)(r.A,{value:"win",label:"Windows",children:(0,a.jsxs)(n.p,{children:["The ",(0,a.jsx)(n.code,{children:"gettext"})," utility is not really supported on Windows. You can refer to the\n",(0,a.jsx)(n.a,{href:"https://docs.djangoproject.com/en/4.1/topics/i18n/translation/#gettext-on-windows",children:"django documentation"}),",\nwhich proposes some alternatives. However, we strongly recommend you to use\n",(0,a.jsx)(n.a,{href:"https://learn.microsoft.com/windows/wsl/install",children:"WSL"})," instead, so as to run\n",(0,a.jsx)(n.em,{children:"Nantral Platform"})," in a Linux machine (in your Windows)."]})}),(0,a.jsxs)(r.A,{value:"mac",label:"MacOS",children:[(0,a.jsx)(n.p,{children:"Run this command:"}),(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"brew install gettext\n"})})]}),(0,a.jsxs)(r.A,{value:"lin",label:"Linux",children:[(0,a.jsx)(n.p,{children:"Run these commands:"}),(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"sudo apt-get update\nsudo apt-get install gettext\n"})})]})]})]}),"\n",(0,a.jsxs)(n.p,{children:["First, create or update the ",(0,a.jsx)(n.code,{children:".po"})," file:"]}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["Go into the app where you want to add translations:","\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"cd apps/<app_name>\n"})}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["Create or update the ",(0,a.jsx)(n.code,{children:".po"})," files for the French translations:","\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"pipenv run django-admin makemessages -l fr\n"})}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["Open the ",(0,a.jsx)(n.code,{children:".po"})," file created in ",(0,a.jsx)(n.code,{children:"locale/fr/LC_MESSAGES"}),",\nand fill in all the translations. You can also use a graphical editor,\nlike ",(0,a.jsx)(n.a,{href:"https://poedit.net/",children:"Poedit"}),"."]}),"\n"]}),"\n",(0,a.jsx)(n.h3,{id:"3-compile-the-translations",children:"3. Compile the translations"}),"\n",(0,a.jsxs)(n.p,{children:["Once you have finished, it's time to compile the translations! Just run, in\nthe ",(0,a.jsx)(n.code,{children:"backend"})," directory:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"pipenv run django compilemessages -l fr\n"})}),"\n",(0,a.jsx)(n.admonition,{type:"tip",children:(0,a.jsxs)(n.p,{children:["If you use ",(0,a.jsx)(n.a,{href:"https://poedit.net/",children:"Poedit"}),", the compilation is automatically\ndone when you save your modifications."]})}),"\n",(0,a.jsx)(n.p,{children:"That's it! You can now run the website, and the translations should adapt to the\nselected language!"}),"\n",(0,a.jsx)(n.h2,{id:"translating-dates",children:"Translating dates"}),"\n",(0,a.jsxs)(n.p,{children:["You can translate dates using the ",(0,a.jsx)(n.code,{children:"django.utils.formats"})," module:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-python",children:"from django.utils import formats\n\nformats.date_format(date, format='SHORT_DATE_FORMAT')\n"})}),"\n",(0,a.jsx)(n.p,{children:"The available formats are:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"SHORT_DATE_FORMAT"})," -> 01/01/2022"]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"SHORT_DATETIME_FORMAT"})," -> 01/01/2022 12:00"]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"DATE_FORMAT"})," -> January 1, 2022"]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"DATETIME_FORMAT"})," -> January 1, 2022, 12:00"]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"TIME_FORMAT"})," -> 12:00"]}),"\n"]}),"\n",(0,a.jsx)(n.h2,{id:"adding-a-new-language",children:"Adding a new language"}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsxs)(n.li,{children:["In the django settings, update the ",(0,a.jsx)(n.code,{children:"LANGUAGES"})," key:","\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-python",metastring:'title="config/settings/base.py"',children:"LANGUAGES = [\n   ('fr', \"Fran\xe7ais\"),\n   ('en', \"English\"),\n   # your language here\n]\n"})}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["Then create all the new ",(0,a.jsx)(n.code,{children:".po"})," files for each app:","\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"cd apps/<app_name>\npipenv run django-admin makemessages -l <your_language_code>\n"})}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["Write all the translations, and finally compile them:","\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"pipenv run django compilemessages -l <you_language_code>\n"})}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["Add the language to the frontend (see ",(0,a.jsx)(n.a,{href:"/dev/frontend/i18n",children:"Frontend i18n"}),")"]}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:"Congratulations \ud83e\udd73 You added a new language!"})]})}function p(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(h,{...e})}):h(e)}},9365:(e,n,t)=>{t.d(n,{A:()=>l});t(6540);var a=t(4164);const s={tabItem:"tabItem_Ymn6"};var r=t(4848);function l(e){let{children:n,hidden:t,className:l}=e;return(0,r.jsx)("div",{role:"tabpanel",className:(0,a.A)(s.tabItem,l),hidden:t,children:n})}},1470:(e,n,t)=>{t.d(n,{A:()=>w});var a=t(6540),s=t(4164),r=t(3104),l=t(6347),i=t(205),o=t(7485),d=t(1682),c=t(679);function u(e){return a.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,a.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:n,children:t}=e;return(0,a.useMemo)((()=>{const e=n??function(e){return u(e).map((e=>{let{props:{value:n,label:t,attributes:a,default:s}}=e;return{value:n,label:t,attributes:a,default:s}}))}(t);return function(e){const n=(0,d.XI)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function p(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function m(e){let{queryString:n=!1,groupId:t}=e;const s=(0,l.W6)(),r=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,o.aZ)(r),(0,a.useCallback)((e=>{if(!r)return;const n=new URLSearchParams(s.location.search);n.set(r,e),s.replace({...s.location,search:n.toString()})}),[r,s])]}function x(e){const{defaultValue:n,queryString:t=!1,groupId:s}=e,r=h(e),[l,o]=(0,a.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!p({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const a=t.find((e=>e.default))??t[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:n,tabValues:r}))),[d,u]=m({queryString:t,groupId:s}),[x,g]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[s,r]=(0,c.Dv)(t);return[s,(0,a.useCallback)((e=>{t&&r.set(e)}),[t,r])]}({groupId:s}),j=(()=>{const e=d??x;return p({value:e,tabValues:r})?e:null})();(0,i.A)((()=>{j&&o(j)}),[j]);return{selectedValue:l,selectValue:(0,a.useCallback)((e=>{if(!p({value:e,tabValues:r}))throw new Error(`Can't select invalid tab value=${e}`);o(e),u(e),g(e)}),[u,g,r]),tabValues:r}}var g=t(2303);const j={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var f=t(4848);function b(e){let{className:n,block:t,selectedValue:a,selectValue:l,tabValues:i}=e;const o=[],{blockElementScrollPositionUntilNextRender:d}=(0,r.a_)(),c=e=>{const n=e.currentTarget,t=o.indexOf(n),s=i[t].value;s!==a&&(d(n),l(s))},u=e=>{let n=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const t=o.indexOf(e.currentTarget)+1;n=o[t]??o[0];break}case"ArrowLeft":{const t=o.indexOf(e.currentTarget)-1;n=o[t]??o[o.length-1];break}}n?.focus()};return(0,f.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.A)("tabs",{"tabs--block":t},n),children:i.map((e=>{let{value:n,label:t,attributes:r}=e;return(0,f.jsx)("li",{role:"tab",tabIndex:a===n?0:-1,"aria-selected":a===n,ref:e=>o.push(e),onKeyDown:u,onClick:c,...r,className:(0,s.A)("tabs__item",j.tabItem,r?.className,{"tabs__item--active":a===n}),children:t??n},n)}))})}function v(e){let{lazy:n,children:t,selectedValue:r}=e;const l=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=l.find((e=>e.props.value===r));return e?(0,a.cloneElement)(e,{className:(0,s.A)("margin-top--md",e.props.className)}):null}return(0,f.jsx)("div",{className:"margin-top--md",children:l.map(((e,n)=>(0,a.cloneElement)(e,{key:n,hidden:e.props.value!==r})))})}function y(e){const n=x(e);return(0,f.jsxs)("div",{className:(0,s.A)("tabs-container",j.tabList),children:[(0,f.jsx)(b,{...n,...e}),(0,f.jsx)(v,{...n,...e})]})}function w(e){const n=(0,g.A)();return(0,f.jsx)(y,{...e,children:u(e.children)},String(n))}},8453:(e,n,t)=>{t.d(n,{R:()=>l,x:()=>i});var a=t(6540);const s={},r=a.createContext(s);function l(e){const n=a.useContext(r);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:l(e.components),a.createElement(r.Provider,{value:n},e.children)}}}]);