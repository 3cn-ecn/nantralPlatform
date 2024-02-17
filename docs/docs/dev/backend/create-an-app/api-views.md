---
sidebar_position: 3
description: Views and Serializers with DRF
---

# Views and Serializers

Now, let's create the views and serializers for our app. We will use the
[Django REST Framework (DRF)](https://www.django-rest-framework.org/) to create
them. Feel free to check their docs for more infos!

For the example, we will use this model:

```python title="models.py"
from django.db import models

from apps.student.models import Student

class Event(models.Model):
    title = models.CharField(max_length=100)
    begin_date = models.DateTimeField("Début")
    end_date = models.DateTimeField("Fin")
    participants = models.ManyToManyField(to=Student, blank=True)
```

## The Serializer classes

The serializer is an object which will transform the data from our database
to JSON so that they can be sent to the front end. We can add extra fields
(like `is_participating` here), and a custom validation.

```python title="serializers.py"
from rest_framework import serializers, exceptions
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    # add a custom field to the serializer
    is_participating = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['title', 'begin_date', 'end_date', 'is_participating']

    # how to compute the value of the 'is_participating' field
    def get_is_participating(self, obj: Event) -> bool:
        student = self.context['request'].user.student
        return obj.participants.contains(student)

    # this is called each time an Event object is sent TO the server
    def validate(self, data: dict[str, any]) -> dict[str, any]:
        """Check that end_date is after begin_date"""
        if data['begin_date'] > data['end_date']:
            raise exceptions.ValidationError(
                "The end date must be after the begin date.")
        # 'validate' must always return the data
        return data
```

In practice, we often create 3 **_serializers_** for one model:

- `EventSerializer`: used when the user asks all infos on one event
- `EventPreviewSerializer`: used when the user asks all events (for example, in a list)
- `EventWriteSerializer`: used when the user wants to create or update an event

For more details about Serializers, read the
[Django REST Framework Documentation](https://www.django-rest-framework.org/api-guide/serializers/).

## The ViewSet class

Then, we will create a ViewSet to have all views to manipulate the serializer.
This ViewSet will automatically creates default views for the Events.

```python title="api_views.py"
from rest_framework import permissions, viewsets
from django.db import QuerySet
from .models import Event
from .serializers import EventSerializer

class EventViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, EventPermission]
    serializer_class = EventSerializer

    def get_queryset(self) -> QuerySet[Event]:
        # queryset used for the list view
        # for other views, the Model will be extracted from this queryset
        return Event.objects.all()
```

We can also use the `get_serializer_class` method to use different serializers
depending of the method (GET, POST, PUT...) and the action
(list, retrieve, create...).

:::info What is a ViewSet?

A ViewSet regroups multiple views for one model. The ViewSet above is approximately
equivalent to the following view set (without permissions):

```python
from rest_framework import generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Event
from .serializers import EventSerializer


class EventList(generics.GenericViewSet):

    def get_queryset(self) -> QuerySet[Event]:
        return Event.objects.all()

    def get_object(self) -> Event:
        return Event.objects.get(pk=self.kwargs['pk'])

    @action(detail=False, methods=['get'])
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = EventSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def create(self, request, *args, **kwargs):
        serializer = EventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def retrieve(self, request, *args, **kwargs):
        event = self.get_object()
        serializer = EventSerializer(event)
        return Response(serializer.data)

    @action(detail=True, methods=['put', 'patch'])
    def update(self, request, *args, **kwargs):
        event = self.get_object()
        serializer = EventSerializer(event, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=True, methods=['delete'])
    def destroy(self, request, *args, **kwargs):
        event = self.get_object()
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
```

:::warning
This example is for learning only! You should **NEVER** code yourself the
`list`, `create`, `retrieve`, `update` and `destroy` methods of a ViewSet.

Instead, override the `get_queryset`,
`get_object` or `get_serializer_class` methods, or add new **_Permission_** or
**_Filter_** classes to the ViewSet. You can also use **_custom actions_**.
:::

For more details about ViewSets, read the
[Django REST Framework Documentation](https://www.django-rest-framework.org/api-guide/viewsets/).

## The Permission classes

For each ViewSet, we must add a **_Permission_** class. This class will check
if the user has the right to do the action.

We can use multiple permission classes in the same view: for example, in the
previous ViewSet, we used `permissions.IsAuthenticated` (to check if the user
is authenticated) with `EventPermission`.

```python
from rest_framework import permissions

class EventPermission(permissions.BasePermission):

    # permission check run for all views, optional
    def has_permission(self, request, view) -> bool:
        # we can use the view.action to know which view was called
        print(view.action)
        return True

    # permission check on ONE particular object, for views with details=True
    def has_object_permission(self, request, view, obj: Event) -> bool:
        if request.method in permissions.SAFE_METHODS:
            # if the method is a safe method (GET, HEAD, OPTIONS),
            # i.e. it does not modify the database
            return True
        # else, if the method ask to modify the database (POST, PUT, PATCH, DELETE),
        # then check that the user is an admin
        return request.user.is_superuser
```
