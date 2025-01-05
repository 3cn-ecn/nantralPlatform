"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[7445],{6352:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>c,contentTitle:()=>u,default:()=>h,frontMatter:()=>i,metadata:()=>r,toc:()=>d});const r=JSON.parse('{"id":"dev/get-started/install-party/vscode","title":"VSCode","description":"A far better text editor than Notepad.exe","source":"@site/docs/dev/get-started/install-party/vscode.mdx","sourceDirName":"dev/get-started/install-party","slug":"/dev/get-started/install-party/vscode","permalink":"/dev/get-started/install-party/vscode","draft":false,"unlisted":false,"editUrl":"https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/docs/dev/get-started/install-party/vscode.mdx","tags":[],"version":"current","lastUpdatedBy":"Alexis Delage","lastUpdatedAt":1712699007000,"sidebarPosition":4,"frontMatter":{"title":"VSCode","sidebar_position":4,"description":"A far better text editor than Notepad.exe"},"sidebar":"sidebar","previous":{"title":"Make","permalink":"/dev/get-started/install-party/make"},"next":{"title":"Git","permalink":"/dev/get-started/install-party/git"}}');var n=a(4848),s=a(8453),o=a(5537),l=a(9329);const i={title:"VSCode",sidebar_position:4,description:"A far better text editor than Notepad.exe"},u="Visual Studio Code",c={},d=[];function p(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",header:"header",hr:"hr",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsx)(t.h1,{id:"visual-studio-code",children:"Visual Studio Code"})}),"\n",(0,n.jsx)(t.p,{children:"You can use whatever text editor suites you the best, however, we strongly encourage you to use Visual Studio Code as we have\ncreated vscode configuration files to make sure everybody follow the same code style."}),"\n",(0,n.jsxs)(o.A,{groupId:"os",children:[(0,n.jsx)(l.A,{value:"win-mac",label:"Windows/MacOS",children:(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["Download the latest release of VSCode from the ",(0,n.jsx)(t.a,{href:"https://code.visualstudio.com/",children:"official website"}),"."]}),"\n",(0,n.jsx)(t.li,{children:"Click on the executable you've just downloaded and follow the instructions."}),"\n"]})}),(0,n.jsxs)(l.A,{value:"lin",label:"Linux",children:[(0,n.jsx)(t.p,{children:"Install the snap package:"}),(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-bash",children:"sudo snap install code --classic\n"})}),(0,n.jsx)(t.admonition,{type:"info",children:(0,n.jsxs)(t.p,{children:["If you prefere, Visual Studio Code is also available as a\n",(0,n.jsx)(t.a,{href:"https://flathub.org/apps/details/com.visualstudio.code",children:"flatpak package"}),",\nor as a ",(0,n.jsx)(t.code,{children:".deb"})," package on the ",(0,n.jsx)(t.a,{href:"https://code.visualstudio.com/download",children:"official website"}),"."]})})]})]}),"\n",(0,n.jsx)(t.hr,{}),"\n",(0,n.jsx)("iframe",{class:"youtube",src:"https://www.youtube-nocookie.com/embed/KMxo3T_MTvY",title:"YouTube video player",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowfullscreen:!0})]})}function h(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(p,{...e})}):p(e)}},9329:(e,t,a)=>{a.d(t,{A:()=>o});a(6540);var r=a(4164);const n={tabItem:"tabItem_Ymn6"};var s=a(4848);function o(e){let{children:t,hidden:a,className:o}=e;return(0,s.jsx)("div",{role:"tabpanel",className:(0,r.A)(n.tabItem,o),hidden:a,children:t})}},5537:(e,t,a)=>{a.d(t,{A:()=>j});var r=a(6540),n=a(4164),s=a(5627),o=a(6347),l=a(372),i=a(604),u=a(1861),c=a(8749);function d(e){return r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function p(e){const{values:t,children:a}=e;return(0,r.useMemo)((()=>{const e=t??function(e){return d(e).map((e=>{let{props:{value:t,label:a,attributes:r,default:n}}=e;return{value:t,label:a,attributes:r,default:n}}))}(a);return function(e){const t=(0,u.XI)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,a])}function h(e){let{value:t,tabValues:a}=e;return a.some((e=>e.value===t))}function f(e){let{queryString:t=!1,groupId:a}=e;const n=(0,o.W6)(),s=function(e){let{queryString:t=!1,groupId:a}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:t,groupId:a});return[(0,i.aZ)(s),(0,r.useCallback)((e=>{if(!s)return;const t=new URLSearchParams(n.location.search);t.set(s,e),n.replace({...n.location,search:t.toString()})}),[s,n])]}function b(e){const{defaultValue:t,queryString:a=!1,groupId:n}=e,s=p(e),[o,i]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!h({value:t,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const r=a.find((e=>e.default))??a[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:t,tabValues:s}))),[u,d]=f({queryString:a,groupId:n}),[b,m]=function(e){let{groupId:t}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(t),[n,s]=(0,c.Dv)(a);return[n,(0,r.useCallback)((e=>{a&&s.set(e)}),[a,s])]}({groupId:n}),v=(()=>{const e=u??b;return h({value:e,tabValues:s})?e:null})();(0,l.A)((()=>{v&&i(v)}),[v]);return{selectedValue:o,selectValue:(0,r.useCallback)((e=>{if(!h({value:e,tabValues:s}))throw new Error(`Can't select invalid tab value=${e}`);i(e),d(e),m(e)}),[d,m,s]),tabValues:s}}var m=a(9136);const v={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var x=a(4848);function g(e){let{className:t,block:a,selectedValue:r,selectValue:o,tabValues:l}=e;const i=[],{blockElementScrollPositionUntilNextRender:u}=(0,s.a_)(),c=e=>{const t=e.currentTarget,a=i.indexOf(t),n=l[a].value;n!==r&&(u(t),o(n))},d=e=>{let t=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const a=i.indexOf(e.currentTarget)+1;t=i[a]??i[0];break}case"ArrowLeft":{const a=i.indexOf(e.currentTarget)-1;t=i[a]??i[i.length-1];break}}t?.focus()};return(0,x.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,n.A)("tabs",{"tabs--block":a},t),children:l.map((e=>{let{value:t,label:a,attributes:s}=e;return(0,x.jsx)("li",{role:"tab",tabIndex:r===t?0:-1,"aria-selected":r===t,ref:e=>{i.push(e)},onKeyDown:d,onClick:c,...s,className:(0,n.A)("tabs__item",v.tabItem,s?.className,{"tabs__item--active":r===t}),children:a??t},t)}))})}function y(e){let{lazy:t,children:a,selectedValue:s}=e;const o=(Array.isArray(a)?a:[a]).filter(Boolean);if(t){const e=o.find((e=>e.props.value===s));return e?(0,r.cloneElement)(e,{className:(0,n.A)("margin-top--md",e.props.className)}):null}return(0,x.jsx)("div",{className:"margin-top--md",children:o.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==s})))})}function w(e){const t=b(e);return(0,x.jsxs)("div",{className:(0,n.A)("tabs-container",v.tabList),children:[(0,x.jsx)(g,{...t,...e}),(0,x.jsx)(y,{...t,...e})]})}function j(e){const t=(0,m.A)();return(0,x.jsx)(w,{...e,children:d(e.children)},String(t))}},8453:(e,t,a)=>{a.d(t,{R:()=>o,x:()=>l});var r=a(6540);const n={},s=r.createContext(n);function o(e){const t=r.useContext(s);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:o(e.components),r.createElement(s.Provider,{value:t},e.children)}}}]);