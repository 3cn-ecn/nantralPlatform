"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[8254],{1617:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>r,contentTitle:()=>o,default:()=>h,frontMatter:()=>l,metadata:()=>a,toc:()=>d});const a=JSON.parse('{"id":"dev/backend/emails","title":"Send Emails","description":"This guide describe how to send emails from the Nantral Platform website.","source":"@site/docs/dev/backend/emails.mdx","sourceDirName":"dev/backend","slug":"/dev/backend/emails","permalink":"/dev/backend/emails","draft":false,"unlisted":false,"editUrl":"https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/docs/dev/backend/emails.mdx","tags":[],"version":"current","lastUpdatedBy":"Alexis Delage","lastUpdatedAt":1712699007000,"sidebarPosition":6,"frontMatter":{"title":"Send Emails","sidebar_position":6},"sidebar":"sidebar","previous":{"title":"Integration Tests","permalink":"/dev/backend/testing/integration-tests"},"next":{"title":"Dependencies (Pipenv)","permalink":"/dev/backend/dependencies"}}');var i=t(4848),s=t(8453);const l={title:"Send Emails",sidebar_position:6},o="How to send emails?",r={},d=[{value:"1\ufe0f\u20e3 Create your email template",id:"1\ufe0f\u20e3-create-your-email-template",level:2},{value:"2\ufe0f\u20e3 Send your email from Django",id:"2\ufe0f\u20e3-send-your-email-from-django",level:2},{value:"3\ufe0f\u20e3 Passing context data from django to the email template",id:"3\ufe0f\u20e3-passing-context-data-from-django-to-the-email-template",level:2},{value:"4\ufe0f\u20e3 Test your email",id:"4\ufe0f\u20e3-test-your-email",level:2},{value:"\ud83d\udedf F.A.Q.",id:"-faq",level:2},{value:"Can I send an email from the React frontend?",id:"can-i-send-an-email-from-the-react-frontend",level:3},{value:"The backend crashes when I try to send an email",id:"the-backend-crashes-when-i-try-to-send-an-email",level:3}];function c(e){const n={a:"a",admonition:"admonition",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"how-to-send-emails",children:"How to send emails?"})}),"\n",(0,i.jsx)(n.p,{children:"This guide describe how to send emails from the Nantral Platform website."}),"\n",(0,i.jsx)(n.h2,{id:"1\ufe0f\u20e3-create-your-email-template",children:"1\ufe0f\u20e3 Create your email template"}),"\n",(0,i.jsxs)(n.p,{children:["First, create your email template with ",(0,i.jsx)(n.a,{href:"https://react.email/docs/introduction",children:"react-email"}),":"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Go into the ",(0,i.jsx)(n.code,{children:"email-templates-generator"})," folder:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"cd email-templates-generator\n"})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"Start the preview server (this is not required, but it is very helpful):"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"npm run start\n"})}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["You can preview your email at ",(0,i.jsx)(n.a,{href:"http://localhost:3000",children:"http://localhost:3000"})]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Create a new email template in the ",(0,i.jsx)(n.code,{children:"emails"})," folder, by copying an existing\ntemplate (for example at the moment we have ",(0,i.jsx)(n.code,{children:"email-confirmation.tsx"})," and\n",(0,i.jsx)(n.code,{children:"reset-password.tsx"}),"), and edit it to your liking!"]}),"\n",(0,i.jsx)(n.admonition,{type:"success",children:(0,i.jsxs)(n.p,{children:["You can check ",(0,i.jsx)(n.a,{href:"https://react.email/docs/introduction",children:"the documentation"})," to\nknow the available components. Do not use standard HTML tags!"]})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"Once you're happy with the result, compile the template to an HTML file:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"npm run build\n"})}),"\n",(0,i.jsx)(n.admonition,{type:"info",children:(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.code,{children:"build"})," command creates 2 files: an HTML file and TXT file. This is\nbecause we need to send them both in an email, given that some email client\ndo not support HTML emails.\nThese 2 files are created in the ",(0,i.jsx)(n.code,{children:"backend/templates/emails"})," folder."]})}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"2\ufe0f\u20e3-send-your-email-from-django",children:"2\ufe0f\u20e3 Send your email from Django"}),"\n",(0,i.jsxs)(n.p,{children:["To send the email from the backend, you need to call this function\nfrom ",(0,i.jsx)(n.code,{children:"backend/apps/utils/send_email.py"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-python",children:"def send_email(\n    subject: str,  # The subject of the email\n    to: str,  # The email address of the recipient\n    template_name: str,  # The name of the template\n    context: Optional[dict[str, Any]] = None,  # The context object\n) -> int:\n"})}),"\n",(0,i.jsx)(n.p,{children:"For example, if we call:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-python",children:'send_email(\n  subject="Hello world",\n  to="toto@example.org",\n  template_name="email-confirmation",\n)\n'})}),"\n",(0,i.jsxs)(n.p,{children:["This will send an email to ",(0,i.jsx)(n.code,{children:"toto@example.org"})," with the subject ",(0,i.jsx)(n.code,{children:'"Hello world"'}),",\nand the content of the email will be the template file located in\n",(0,i.jsx)(n.code,{children:"email-templates-generator/emails/email-confirmation.tsx"}),". The email will be\nsent from the address ",(0,i.jsx)(n.code,{children:"no-reply@nantral-platform.fr"}),". The function then\nreturns 0 if the email was sent successfully, or 1 if an error occurred."]}),"\n",(0,i.jsxs)(n.p,{children:["If you want to send an email to multiple users at the same time, you can\nuse the function ",(0,i.jsx)(n.code,{children:"send_mass_email"})," from the same file."]}),"\n",(0,i.jsx)(n.admonition,{type:"caution",children:(0,i.jsxs)(n.p,{children:["In order to avoid being flagged as SPAM, we should avoid sending more than 30-50 emails at once, especially to ",(0,i.jsx)(n.code,{children:"@ec-nantes.fr"}),", which is more restrictive than big email providers such as Google."]})}),"\n",(0,i.jsx)(n.h2,{id:"3\ufe0f\u20e3-passing-context-data-from-django-to-the-email-template",children:"3\ufe0f\u20e3 Passing context data from django to the email template"}),"\n",(0,i.jsx)(n.p,{children:"If you want to customize your template for the user to which you send the mail,\nyou can pass some context data to the template."}),"\n",(0,i.jsx)(n.p,{children:"Here is a quick start example:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-tsx",metastring:'title="email-templates-generator/emails/example-email.tsx"',children:"type Props = {\n   firstName?: string;\n   validationLink?: string;\n};\nconst ActivateYourAccountEmail = ({\n   firstName = '{{first_name|title}}',\n   validationLink = '{{validation_link}}',\n}: Props) => (\n   <Html>\n      <Text>Bonjour {firstName} !</Text>\n      <Text>\n         Valide ton compte{' '}\n         <Link href={validationLink}>en cliquant ici ici</Link>\n      </Text>\n   </Html>\n);\n"})}),"\n",(0,i.jsx)(n.p,{children:"Then, in your python code:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-python",children:'send_email(\n  subject="Hello world",\n  to="toto@example.org",\n  template_name="example-email",\n  context={\n    "first_name": "Toto",\n    "validation_link": "https://nantral-platform.fr/validation/123456789",\n  },\n)\n'})}),"\n",(0,i.jsx)(n.admonition,{title:"Some things to know...",type:"note",children:(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["The name of the django context variables must be put in strings, with\ndouble-brackets (",(0,i.jsx)(n.code,{children:"{{variable_name}}"}),"), in the React template. This is because\nthe template with context data is compiled by Django, and not React."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["You can still use django filters and tags in the variable template (for\nexample ",(0,i.jsx)(n.code,{children:"{{user.first_name|title}}"}),")."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["If you need to send a link to the website, do not hard-code the domain name\n",(0,i.jsx)(n.code,{children:"nantral-platform.fr"}),": instead, use the django method\n",(0,i.jsx)(n.code,{children:"request.build_absolute_uri('/some/path')"})," to build the URL. This allows us to\nuse the correct domain name in development, staging and production."]}),"\n"]}),"\n"]})}),"\n",(0,i.jsx)(n.h2,{id:"4\ufe0f\u20e3-test-your-email",children:"4\ufe0f\u20e3 Test your email"}),"\n",(0,i.jsx)(n.p,{children:"We already seen that you can preview your email in the browser, but you must\nhave noticed that this preview does not include the context data."}),"\n",(0,i.jsx)(n.p,{children:"To test your email during runtime, you have 2 options:"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Use ",(0,i.jsx)(n.strong,{children:"Docker"})," to locally run the server:"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Launch the website locally with docker:","\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"cd deployment\ndocker compose build\ndocker compose up\n"})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["Go to ",(0,i.jsx)(n.a,{href:"http://localhost",children:"http://localhost"})," and create a new account\n(your local account already created will not work, because you are\nusing a different database in docker-mode)."]}),"\n",(0,i.jsxs)(n.li,{children:["Go to ",(0,i.jsx)(n.a,{href:"http://localhost:8025",children:"http://localhost:8025"}),": this is a fake email\nserver that will run locally. All emails sent from django in local with\ndocker should be redirected here. You should also have received the email\nto validate the account created at the previous step."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["\u27a1\ufe0f Find more info on the ",(0,i.jsx)(n.a,{href:"/dev/server/docker",children:"Docker"})," page."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Use the ",(0,i.jsx)(n.a,{href:"/dev/server/staging-server/",children:"Staging Server"}),":\nthis method is easier, but be aware that you will use the real email server,\nso be sure to not send test emails to other users!"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"-faq",children:"\ud83d\udedf F.A.Q."}),"\n",(0,i.jsx)(n.h3,{id:"can-i-send-an-email-from-the-react-frontend",children:"Can I send an email from the React frontend?"}),"\n",(0,i.jsx)(n.p,{children:"No, you can't. If you wish to make this, you need to create an API route in\nDjango that send an email, and then call this route in the React frontend."}),"\n",(0,i.jsx)(n.h3,{id:"the-backend-crashes-when-i-try-to-send-an-email",children:"The backend crashes when I try to send an email"}),"\n",(0,i.jsx)(n.p,{children:"Check that:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["you have compiled the email template with ",(0,i.jsx)(n.code,{children:"npm run build"})," (for local dev only,\nthis is done automatically in production)"]}),"\n",(0,i.jsxs)(n.li,{children:["the name of the template in the ",(0,i.jsx)(n.code,{children:"send_email"})," function is correct (you should\nnot include the ",(0,i.jsx)(n.code,{children:".tsx"}),", ",(0,i.jsx)(n.code,{children:".html"}),", or ",(0,i.jsx)(n.code,{children:".txt"})," extension)"]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>l,x:()=>o});var a=t(6540);const i={},s=a.createContext(i);function l(e){const n=a.useContext(s);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:l(e.components),a.createElement(s.Provider,{value:n},e.children)}}}]);