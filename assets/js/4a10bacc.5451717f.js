"use strict";(self.webpackChunknantralplatform_docs=self.webpackChunknantralplatform_docs||[]).push([[2630],{4835:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>l,contentTitle:()=>a,default:()=>h,frontMatter:()=>r,metadata:()=>o,toc:()=>d});var n=t(5893),i=t(1151);const r={sidebar_position:3,description:"Views and Serializers with DRF"},a="Views and Serializers",o={id:"dev/backend/create-an-app/api-views",title:"Views and Serializers",description:"Views and Serializers with DRF",source:"@site/docs/dev/backend/create-an-app/api-views.md",sourceDirName:"dev/backend/create-an-app",slug:"/dev/backend/create-an-app/api-views",permalink:"/dev/backend/create-an-app/api-views",draft:!1,unlisted:!1,editUrl:"https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/docs/dev/backend/create-an-app/api-views.md",tags:[],version:"current",lastUpdatedBy:"Alexis Delage",lastUpdatedAt:1708213114,formattedLastUpdatedAt:"Feb 17, 2024",sidebarPosition:3,frontMatter:{sidebar_position:3,description:"Views and Serializers with DRF"},sidebar:"sidebar",previous:{title:"Models & Migrations",permalink:"/dev/backend/create-an-app/models"},next:{title:"Manage URLs",permalink:"/dev/backend/create-an-app/urls"}},l={},d=[{value:"The Serializer classes",id:"the-serializer-classes",level:2},{value:"The ViewSet class",id:"the-viewset-class",level:2},{value:"The Permission classes",id:"the-permission-classes",level:2}];function c(e){const s={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.h1,{id:"views-and-serializers",children:"Views and Serializers"}),"\n",(0,n.jsxs)(s.p,{children:["Now, let's create the views and serializers for our app. We will use the\n",(0,n.jsx)(s.a,{href:"https://www.django-rest-framework.org/",children:"Django REST Framework (DRF)"})," to create\nthem. Feel free to check their docs for more infos!"]}),"\n",(0,n.jsx)(s.p,{children:"For the example, we will use this model:"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-python",metastring:'title="models.py"',children:'from django.db import models\n\nfrom apps.student.models import Student\n\nclass Event(models.Model):\n    title = models.CharField(max_length=100)\n    begin_date = models.DateTimeField("D\xe9but")\n    end_date = models.DateTimeField("Fin")\n    participants = models.ManyToManyField(to=Student, blank=True)\n'})}),"\n",(0,n.jsx)(s.h2,{id:"the-serializer-classes",children:"The Serializer classes"}),"\n",(0,n.jsxs)(s.p,{children:["The serializer is an object which will transform the data from our database\nto JSON so that they can be sent to the front end. We can add extra fields\n(like ",(0,n.jsx)(s.code,{children:"is_participating"})," here), and a custom validation."]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-python",metastring:'title="serializers.py"',children:"from rest_framework import serializers, exceptions\nfrom .models import Event\n\nclass EventSerializer(serializers.ModelSerializer):\n    # add a custom field to the serializer\n    is_participating = serializers.SerializerMethodField()\n\n    class Meta:\n        model = Event\n        fields = ['title', 'begin_date', 'end_date', 'is_participating']\n\n    # how to compute the value of the 'is_participating' field\n    def get_is_participating(self, obj: Event) -> bool:\n        student = self.context['request'].user.student\n        return obj.participants.contains(student)\n\n    # this is called each time an Event object is sent TO the server\n    def validate(self, data: dict[str, any]) -> dict[str, any]:\n        \"\"\"Check that end_date is after begin_date\"\"\"\n        if data['begin_date'] > data['end_date']:\n            raise exceptions.ValidationError(\n                \"The end date must be after the begin date.\")\n        # 'validate' must always return the data\n        return data\n"})}),"\n",(0,n.jsxs)(s.p,{children:["In practice, we often create 3 ",(0,n.jsx)(s.strong,{children:(0,n.jsx)(s.em,{children:"serializers"})})," for one model:"]}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.code,{children:"EventSerializer"}),": used when the user asks all infos on one event"]}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.code,{children:"EventPreviewSerializer"}),": used when the user asks all events (for example, in a list)"]}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.code,{children:"EventWriteSerializer"}),": used when the user wants to create or update an event"]}),"\n"]}),"\n",(0,n.jsxs)(s.p,{children:["For more details about Serializers, read the\n",(0,n.jsx)(s.a,{href:"https://www.django-rest-framework.org/api-guide/serializers/",children:"Django REST Framework Documentation"}),"."]}),"\n",(0,n.jsx)(s.h2,{id:"the-viewset-class",children:"The ViewSet class"}),"\n",(0,n.jsx)(s.p,{children:"Then, we will create a ViewSet to have all views to manipulate the serializer.\nThis ViewSet will automatically creates default views for the Events."}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-python",metastring:'title="api_views.py"',children:"from rest_framework import permissions, viewsets\nfrom django.db import QuerySet\nfrom .models import Event\nfrom .serializers import EventSerializer\n\nclass EventViewSet(viewsets.ModelViewSet):\n    permission_classes = [permissions.IsAuthenticated, EventPermission]\n    serializer_class = EventSerializer\n\n    def get_queryset(self) -> QuerySet[Event]:\n        # queryset used for the list view\n        # for other views, the Model will be extracted from this queryset\n        return Event.objects.all()\n"})}),"\n",(0,n.jsxs)(s.p,{children:["We can also use the ",(0,n.jsx)(s.code,{children:"get_serializer_class"})," method to use different serializers\ndepending of the method (GET, POST, PUT...) and the action\n(list, retrieve, create...)."]}),"\n",(0,n.jsxs)(s.admonition,{title:"What is a ViewSet?",type:"info",children:[(0,n.jsx)(s.p,{children:"A ViewSet regroups multiple views for one model. The ViewSet above is approximately\nequivalent to the following view set (without permissions):"}),(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-python",children:"from rest_framework import generics, status\nfrom rest_framework.decorators import action\nfrom rest_framework.response import Response\nfrom .models import Event\nfrom .serializers import EventSerializer\n\n\nclass EventList(generics.GenericViewSet):\n\n    def get_queryset(self) -> QuerySet[Event]:\n        return Event.objects.all()\n\n    def get_object(self) -> Event:\n        return Event.objects.get(pk=self.kwargs['pk'])\n\n    @action(detail=False, methods=['get'])\n    def list(self, request, *args, **kwargs):\n        queryset = self.get_queryset()\n        serializer = EventSerializer(queryset, many=True)\n        return Response(serializer.data)\n\n    @action(detail=False, methods=['post'])\n    def create(self, request, *args, **kwargs):\n        serializer = EventSerializer(data=request.data)\n        serializer.is_valid(raise_exception=True)\n        serializer.save()\n        return Response(serializer.data, status=status.HTTP_201_CREATED)\n\n    @action(detail=True, methods=['get'])\n    def retrieve(self, request, *args, **kwargs):\n        event = self.get_object()\n        serializer = EventSerializer(event)\n        return Response(serializer.data)\n\n    @action(detail=True, methods=['put', 'patch'])\n    def update(self, request, *args, **kwargs):\n        event = self.get_object()\n        serializer = EventSerializer(event, data=request.data, partial=True)\n        serializer.is_valid(raise_exception=True)\n        serializer.save()\n        return Response(serializer.data)\n\n    @action(detail=True, methods=['delete'])\n    def destroy(self, request, *args, **kwargs):\n        event = self.get_object()\n        event.delete()\n        return Response(status=status.HTTP_204_NO_CONTENT)\n"})}),(0,n.jsxs)(s.admonition,{type:"warning",children:[(0,n.jsxs)(s.p,{children:["This example is for learning only! You should ",(0,n.jsx)(s.strong,{children:"NEVER"})," code yourself the\n",(0,n.jsx)(s.code,{children:"list"}),", ",(0,n.jsx)(s.code,{children:"create"}),", ",(0,n.jsx)(s.code,{children:"retrieve"}),", ",(0,n.jsx)(s.code,{children:"update"})," and ",(0,n.jsx)(s.code,{children:"destroy"})," methods of a ViewSet."]}),(0,n.jsxs)(s.p,{children:["Instead, override the ",(0,n.jsx)(s.code,{children:"get_queryset"}),",\n",(0,n.jsx)(s.code,{children:"get_object"})," or ",(0,n.jsx)(s.code,{children:"get_serializer_class"})," methods, or add new ",(0,n.jsx)(s.strong,{children:(0,n.jsx)(s.em,{children:"Permission"})})," or\n",(0,n.jsx)(s.strong,{children:(0,n.jsx)(s.em,{children:"Filter"})})," classes to the ViewSet. You can also use ",(0,n.jsx)(s.strong,{children:(0,n.jsx)(s.em,{children:"custom actions"})}),"."]})]})]}),"\n",(0,n.jsxs)(s.p,{children:["For more details about ViewSets, read the\n",(0,n.jsx)(s.a,{href:"https://www.django-rest-framework.org/api-guide/viewsets/",children:"Django REST Framework Documentation"}),"."]}),"\n",(0,n.jsx)(s.h2,{id:"the-permission-classes",children:"The Permission classes"}),"\n",(0,n.jsxs)(s.p,{children:["For each ViewSet, we must add a ",(0,n.jsx)(s.strong,{children:(0,n.jsx)(s.em,{children:"Permission"})})," class. This class will check\nif the user has the right to do the action."]}),"\n",(0,n.jsxs)(s.p,{children:["We can use multiple permission classes in the same view: for example, in the\nprevious ViewSet, we used ",(0,n.jsx)(s.code,{children:"permissions.IsAuthenticated"})," (to check if the user\nis authenticated) with ",(0,n.jsx)(s.code,{children:"EventPermission"}),"."]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-python",children:"from rest_framework import permissions\n\nclass EventPermission(permissions.BasePermission):\n\n    # permission check run for all views, optional\n    def has_permission(self, request, view) -> bool:\n        # we can use the view.action to know which view was called\n        print(view.action)\n        return True\n\n    # permission check on ONE particular object, for views with details=True\n    def has_object_permission(self, request, view, obj: Event) -> bool:\n        if request.method in permissions.SAFE_METHODS:\n            # if the method is a safe method (GET, HEAD, OPTIONS),\n            # i.e. it does not modify the database\n            return True\n        # else, if the method ask to modify the database (POST, PUT, PATCH, DELETE),\n        # then check that the user is an admin\n        return request.user.is_superuser\n"})})]})}function h(e={}){const{wrapper:s}={...(0,i.a)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}},1151:(e,s,t)=>{t.d(s,{Z:()=>o,a:()=>a});var n=t(7294);const i={},r=n.createContext(i);function a(e){const s=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function o(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),n.createElement(r.Provider,{value:s},e.children)}}}]);