"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[6131],{7024:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>s,default:()=>p,frontMatter:()=>o,metadata:()=>r,toc:()=>l});var a=t(5893),i=t(1151);const o={sidebar_position:2},s="Models & Migrations",r={id:"dev/backend/create-an-app/models",title:"Models & Migrations",description:"Create and update models",source:"@site/docs/dev/backend/create-an-app/models.md",sourceDirName:"dev/backend/create-an-app",slug:"/dev/backend/create-an-app/models",permalink:"/dev/backend/create-an-app/models",draft:!1,unlisted:!1,editUrl:"https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/docs/dev/backend/create-an-app/models.md",tags:[],version:"current",lastUpdatedBy:"Alexis Delage",lastUpdatedAt:1708213114,formattedLastUpdatedAt:"Feb 17, 2024",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"sidebar",previous:{title:"Create the new app",permalink:"/dev/backend/create-an-app/create-new-app"},next:{title:"Views and Serializers",permalink:"/dev/backend/create-an-app/api-views"}},d={},l=[{value:"Create and update models",id:"create-and-update-models",level:2},{value:"Query objects",id:"query-objects",level:2},{value:"More on migrations",id:"more-on-migrations",level:2},{value:"Good practices",id:"good-practices",level:3},{value:"Applying and un-applying migrations",id:"applying-and-un-applying-migrations",level:3},{value:"Writing a custom migration",id:"writing-a-custom-migration",level:3}];function c(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.h1,{id:"models--migrations",children:"Models & Migrations"}),"\n",(0,a.jsx)(n.h2,{id:"create-and-update-models",children:"Create and update models"}),"\n",(0,a.jsxs)(n.p,{children:["To create a new model, you have to create a new class in the ",(0,a.jsx)(n.code,{children:"models.py"})," file of\nan app."]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-python",metastring:'title="models.py"',children:'from django.db import models\n\nfrom apps.student.models import Student\n\nclass Event(models.Model):\n    title = models.CharField(max_length=100)\n    begin_date = models.DateTimeField("D\xe9but")\n    end_date = models.DateTimeField("Fin")\n    publisher = models.ForeignKey(to=Student, on_delete=models.CASCADE)\n'})}),"\n",(0,a.jsx)(n.admonition,{title:"Important note",type:"danger",children:(0,a.jsx)(n.p,{children:"After creating or updating a model, you must update the database!"})}),"\n",(0,a.jsx)(n.p,{children:"Now we need to update the database. First, let's create a migration file:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"pipenv run makemigrations [app_name]\n"})}),"\n",(0,a.jsx)(n.p,{children:"Then, apply the migration on your own database:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"pipenv run migrate\n"})}),"\n",(0,a.jsxs)(n.admonition,{title:"Why migration files are important?",type:"info",children:[(0,a.jsxs)(n.p,{children:["A migration files describe how to ",(0,a.jsx)(n.strong,{children:"move"})," the database from the previous\nstructure to the new ",(0,a.jsx)(n.strong,{children:"structure"})," you described in your models.\nWithout a migration file, ",(0,a.jsx)(n.strong,{children:"all data will be erased"})," each time you update\nthe models, which is not really what we want! \ud83d\ude31"]}),(0,a.jsxs)(n.p,{children:["Most of the time, ",(0,a.jsx)(n.em,{children:"Django"})," is smart enough to migrate the data without loss.\nBut in some cases, the migration can be more ",(0,a.jsx)(n.strong,{children:"complicated"})," and you have to\n",(0,a.jsx)(n.strong,{children:"write"})," the migration file ",(0,a.jsx)(n.strong,{children:(0,a.jsx)(n.em,{children:"yourself"})})," to avoid any data loss!"]}),(0,a.jsxs)(n.p,{children:["See ",(0,a.jsx)(n.a,{href:"#more-on-migrations",children:"More on migrations"})," for more details."]})]}),"\n",(0,a.jsxs)(n.p,{children:["Learn more on models and fields in the ",(0,a.jsx)(n.a,{href:"https://docs.djangoproject.com/en/5.0/topics/db/models/",children:"official documentation"}),"."]}),"\n",(0,a.jsx)(n.h2,{id:"query-objects",children:"Query objects"}),"\n",(0,a.jsx)(n.p,{children:"In your view, you will often need to query objects from the database.\nHere are some examples of how to do it:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-python",children:'from .models import Event\n\ndef my_view(request):\n    # Get one event\n    my_event = Event.objects.get(id=2)\n    # Get all events\n    event_list = Event.objects.all()\n\n    # Get events after a specific date\n    recent_events = Event.objects.filter(begin_date__gte="2021-01-01")\n    # or re-use the previous query\n    recent_events = event_list.filter(begin_date__gte="2021-01-01")\n\n    # Get events from a specific publisher\n    current_student = request.user.student\n    published_events = Event.objects.filter(publisher=current_student)\n    # or use the reverse relation\n    published_events = current_student.event_set.all()\n'})}),"\n",(0,a.jsxs)(n.p,{children:["Learn more on queries in the ",(0,a.jsx)(n.a,{href:"https://docs.djangoproject.com/en/5.0/topics/db/queries/",children:"official documentation"}),"."]}),"\n",(0,a.jsx)(n.h2,{id:"more-on-migrations",children:"More on migrations"}),"\n",(0,a.jsx)(n.h3,{id:"good-practices",children:"Good practices"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["Try to ",(0,a.jsx)(n.strong,{children:"merge"})," migration files into ",(0,a.jsx)(n.strong,{children:"one file"})," as much as possible: we\ntry to have as few migration files as possible. To do so, ",(0,a.jsx)(n.strong,{children:(0,a.jsx)(n.em,{children:"un-apply"})})," your\nlast migrations files, ",(0,a.jsx)(n.strong,{children:(0,a.jsx)(n.em,{children:"delete"})})," them, and\n",(0,a.jsx)(n.strong,{children:(0,a.jsx)(n.em,{children:"recreate a new"})})," migration file.","\n",(0,a.jsx)(n.admonition,{title:"Be careful",type:"warning",children:(0,a.jsxs)(n.p,{children:["You can't change migration files once they are uploaded to\nthe ",(0,a.jsx)(n.code,{children:"master"})," branch on the server."]})}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(n.h3,{id:"applying-and-un-applying-migrations",children:"Applying and un-applying migrations"}),"\n",(0,a.jsxs)(n.p,{children:["Let's suppose you have an app called ",(0,a.jsx)(n.code,{children:"event"}),", with 5 files.\nOnly the first 2 migrations are applied on your database:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-python",children:"0001_initial.py                  # already applied on your database\n0002_auto_20200626_2132.py       # already applied on your database\n0003_auto_social_network_init.py # not applied\n0004_move_social_network.py      # not applied\n0005_move_liste.py               # not applied\n"})}),"\n",(0,a.jsx)(n.p,{children:"Now you can do multiple things:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["If you want to apply ",(0,a.jsx)(n.strong,{children:"all migrations"})," (3, 4 and 5):","\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"pipenv run migrate event\n"})}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["If you want to apply ",(0,a.jsx)(n.strong,{children:"only"})," migrations 3 and 4, but not 5:","\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"pipenv run migrate event 0004\n"})}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["If you want to ",(0,a.jsx)(n.strong,{children:"un-apply"})," the migration n\xb02,\nand return to the state after the migration n\xb01:","\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"pipenv run migrate event 0001\n"})}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(n.h3,{id:"writing-a-custom-migration",children:"Writing a custom migration"}),"\n",(0,a.jsx)(n.p,{children:"You can write custom migrations, for example to transfer or copy data from\none table to another."}),"\n",(0,a.jsxs)(n.p,{children:["First, create an ",(0,a.jsx)(n.strong,{children:(0,a.jsx)(n.em,{children:"empty"})})," migration file with:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"pipenv run makemigrations <app_name> --empty --name <file_name>\n"})}),"\n",(0,a.jsxs)(n.p,{children:["Then, go to the ",(0,a.jsx)(n.code,{children:"migrations"})," directory, and edit the new created file\nto implement your custom migrations."]}),"\n",(0,a.jsxs)(n.p,{children:["You can find examples of custom migrations by searching for ",(0,a.jsx)(n.code,{children:"RunPython"})," in the\n",(0,a.jsx)(n.em,{children:"Nantral Platform"})," code. You can also use\n",(0,a.jsx)(n.a,{href:"https://docs.djangoproject.com/en/4.1/howto/writing-migrations/",children:"the django documentation"}),"\nto know how to write custom migrations."]})]})}function p(e={}){const{wrapper:n}={...(0,i.a)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(c,{...e})}):c(e)}},1151:(e,n,t)=>{t.d(n,{Z:()=>r,a:()=>s});var a=t(7294);const i={},o=a.createContext(i);function s(e){const n=a.useContext(o);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),a.createElement(o.Provider,{value:n},e.children)}}}]);