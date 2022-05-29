"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[317],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return m}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=r.createContext({}),u=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),p=u(n),m=o,f=p["".concat(s,".").concat(m)]||p[m]||d[m]||a;return n?r.createElement(f,l(l({ref:t},c),{},{components:n})):r.createElement(f,l({ref:t},c))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,l=new Array(a);l[0]=p;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:o,l[1]=i;for(var u=2;u<a;u++)l[u]=n[u];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},1348:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return s},default:function(){return m},frontMatter:function(){return i},metadata:function(){return u},toc:function(){return d}});var r=n(7462),o=n(3366),a=(n(7294),n(3905)),l=["components"],i={title:"Guidelines",sidebar_position:1},s="Guidelines",u={unversionedId:"contribute/guidelines",id:"contribute/guidelines",title:"Guidelines",description:"Every major open-source project has its own style guide: a set of conventions",source:"@site/docs/contribute/guidelines.md",sourceDirName:"contribute",slug:"/contribute/guidelines",permalink:"/docs/contribute/guidelines",draft:!1,editUrl:"https://github.com/nantral-platform/nantralPlatform/tree/master/docs/docs/contribute/guidelines.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Guidelines",sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Contribute",permalink:"/docs/category/contribute"},next:{title:"Test your code",permalink:"/docs/contribute/tests"}},c={},d=[{value:"Git",id:"git",level:2},{value:"Code formatting",id:"code-formatting",level:2},{value:"Python",id:"python",level:3},{value:"Django",id:"django",level:2},{value:"React",id:"react",level:2}],p={toc:d};function m(e){var t=e.components,n=(0,o.Z)(e,l);return(0,a.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"guidelines"},"Guidelines"),(0,a.kt)("p",null,"Every major open-source project has its own style guide: a set of conventions\n(sometimes arbitrary) about how to write code for that project. It is much\neasier to understand a large codebase when all the code in it has a consistent\nstyle."),(0,a.kt)("h2",{id:"git"},"Git"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Write clear and concise commit messages describing your changes :",(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"add Club model"),(0,a.kt)("li",{parentName:"ul"},"reworked News model"))),(0,a.kt)("li",{parentName:"ul"},"One feature or bug fix per branch. Always base a new branch from master. ",(0,a.kt)("strong",{parentName:"li"},"Never base a branch on another branch."))),(0,a.kt)("h2",{id:"code-formatting"},"Code formatting"),(0,a.kt)("h3",{id:"python"},"Python"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Use the ",(0,a.kt)("a",{parentName:"li",href:"https://github.com/nantral-platform/nantralPlatform/blob/master/.vscode/settings-sample.json"},"provided VSCode configuration")," to enforce a unified coding style."),(0,a.kt)("li",{parentName:"ul"},"Add docstrings to every class based view, using the ",(0,a.kt)("a",{parentName:"li",href:"https://marketplace.visualstudio.com/items?itemName=njpwerner.autodocstring"},"autoDocstring extension")," for VSCode."),(0,a.kt)("li",{parentName:"ul"},"Use the following naming convention (which follows the ",(0,a.kt)("a",{parentName:"li",href:"https://peps.python.org/pep-0008/"},"PEP8")," guidelines for Python):")),(0,a.kt)("table",{class:"table table-hover"},(0,a.kt)("thead",null,(0,a.kt)("tr",null,(0,a.kt)("th",null,"Type"),(0,a.kt)("th",null,"Naming Convention"),(0,a.kt)("th",null,"Examples"))),(0,a.kt)("tbody",null,(0,a.kt)("tr",null,(0,a.kt)("td",null,"Function"),(0,a.kt)("td",null,"Use a lowercase word or words. Separate words by underscores to improve readability."),(0,a.kt)("td",null,(0,a.kt)("code",null,"function"),", ",(0,a.kt)("code",null,"my_function"))),(0,a.kt)("tr",null,(0,a.kt)("td",null,"Variable"),(0,a.kt)("td",null,"Use a lowercase single letter, word, or words. Separate words with underscores to improve readability."),(0,a.kt)("td",null,(0,a.kt)("code",null,"x"),", ",(0,a.kt)("code",null,"var"),", ",(0,a.kt)("code",null,"my_variable"))),(0,a.kt)("tr",null,(0,a.kt)("td",null,"Class"),(0,a.kt)("td",null,"Start each word with a capital letter. Do not separate words with underscores. This style is called camel case."),(0,a.kt)("td",null,(0,a.kt)("code",null,"Model"),", ",(0,a.kt)("code",null,"MyClass"))),(0,a.kt)("tr",null,(0,a.kt)("td",null,"Method"),(0,a.kt)("td",null,"Use a lowercase word or words. Separate words with underscores to improve readability."),(0,a.kt)("td",null,(0,a.kt)("code",null,"class_method"),", ",(0,a.kt)("code",null,"method"))),(0,a.kt)("tr",null,(0,a.kt)("td",null,"Constant"),(0,a.kt)("td",null,"Use an uppercase single letter, word, or words. Separate words with underscores to improve readability."),(0,a.kt)("td",null,(0,a.kt)("code",null,"CONSTANT"),", ",(0,a.kt)("code",null,"MY_CONSTANT"),", ",(0,a.kt)("code",null,"MY_LONG_CONSTANT"))),(0,a.kt)("tr",null,(0,a.kt)("td",null,"Module"),(0,a.kt)("td",null,"Use a short, lowercase word or words. Separate words with underscores to improve readability."),(0,a.kt)("td",null,(0,a.kt)("code",null,"module.py"),", ",(0,a.kt)("code",null,"my_module.py"))),(0,a.kt)("tr",null,(0,a.kt)("td",null,"Package"),(0,a.kt)("td",null,"Use a short, lowercase word or words. Do not separate words with underscores."),(0,a.kt)("td",null,(0,a.kt)("code",null,"package"),", ",(0,a.kt)("code",null,"mypackage"))))),(0,a.kt)("h2",{id:"django"},"Django"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Keep Django applications as small as possible."),(0,a.kt)("li",{parentName:"ul"},"Every new feature has to be implemented in a new Django application. Fo instance, the club application should only be used to manage clubs. Furthermore, the news application, even though it's being used by clubs, should not be a function of clubs but a standalone app. This ensures atomicity and easy unittesting."),(0,a.kt)("li",{parentName:"ul"},"When developping localy, do use a virtual environment."),(0,a.kt)("li",{parentName:"ul"},"Write (at least) one unittest per Django view."),(0,a.kt)("li",{parentName:"ul"},"Make sure to also test incorrect data inputs. For exemple you can test that no club manager can publish on another club's page.")),(0,a.kt)("h2",{id:"react"},"React"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Use TypeScript to its maximum. Every API call should expect a specific JSON format, and therefore a JavaScript object with a clear interface. Use ",(0,a.kt)("a",{parentName:"li",href:"https://quicktype.io/typescript"},"this website")," to convert JSON to a TypeScript interface."),(0,a.kt)("li",{parentName:"ul"},"While React supports class based components, the future of React is functional, thus use functions as much as possible."),(0,a.kt)("li",{parentName:"ul"},"Split components as much as possible."),(0,a.kt)("li",{parentName:"ul"},"Keep one component per module. Use ",(0,a.kt)("a",{parentName:"li",href:"https://github.com/nantral-platform/nantralPlatform/blob/master/frontend/src/containers/clubsList.tsx"},"clubsList")," for reference."),(0,a.kt)("li",{parentName:"ul"},"Only use axios when dealing with PUT, POST and DELETE. Use fetch otherwise (this results in smaller bundle sizes)."),(0,a.kt)("li",{parentName:"ul"},"Only use one UI framework at a time to reduce bundle size.")))}m.isMDXComponent=!0}}]);