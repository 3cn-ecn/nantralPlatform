---
last_update:
  date: 2023-02-18 19:28:38 +0100
  author: Alexis Delage
sidebar_position: 5
description: How to share data between the front and the back end
---

# Rest API

* **[Quick tutorial on the Django REST Framework](https://blog.logrocket.com/creating-an-app-with-react-and-django/)**

<iframe 
    class="youtube"
    src="https://www.youtube-nocookie.com/embed/-MTSQjw5DrM" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
</iframe>

## How to create an API endpoint

Let's see how to create an API endpoint with the example of events.

### The Model

First, create a simple model in the database with some fields. We will use here the example of events.

```python title="models.py"
from django.db import models

class Event(models.Model):
    title = models.CharField("Titre", max_length=50)
    begin_date = models.DateTimeField("Début")
    end_date = models.DateTimeField("Fin")
    participants = models.ManyToManyField(
        to=Student, verbose_name='Participants', blank=True)
```

### The Serializer

The serializer is an object which will transform the data from our database
to JSON so that they can be sent to the front end. We can add extra fields
(like `is_participating` here), and add a custom validation.

```python title="serializers.py"
from rest_framework import serializers, exceptions
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    is_participating = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['title', 'begin_date', 'end_date', 'is_participating']

    def get_is_participating(self, obj: Event) -> bool:
        # get the 'is_participating' field
        student = self.context['request'].user.student
        return obj.participants.contains(student)

    def validate(self, data: dict[str, any]) -> dict[str, any]:
        """Check that end_date is after begin_date"""
        if data['begin_date'] > data['end_date']:
            # raise exception if not valid
            raise exceptions.ValidationError(
                "The end date must be after the begin date.")
        # if valid, returns data
        return data
```

For more details about Serializers, read the
[Django REST Framework Documentation](https://www.django-rest-framework.org/api-guide/serializers/).

### The ViewSet

Then, we will create a ViewSet to have all views to manipulate the serializer.
We add a custom `Permission` class, which allows to manage the event only if the
user is a superadmin.

The ViewSet will automatically creates default views for the Events (see the
table below).

```python title="api_views.py"
from rest_framework import permissions, viewsets
from django.db import QuerySet
from .models import Event
from .serializers import EventSerializer


class EventPermission(permissions.BasePermission):

    def has_permission(self, request, view) -> bool:
        # permission check run for all views, optional
        return True

    def has_object_permission(self, request, view, obj: Event) -> bool:
        # this method is only called on views that make actions on ONE object.
        if request.method in permissions.SAFE_METHODS:
            # if the method is a safe method (GET, HEAD, OPTIONS), i.e. it
            # does not modify the database, then allow
            return True
        # else, if the method ask to modify the database (POST, PUT, PATCH, DELETE),
        # then check that the user is an admin
        return request.user.is_superuser


class EventViewSet(viewsets.ModelViewSet):
    # check the custom permission and the default authentification permission
    permission_classes = [permissions.IsAuthenticated, EventPermission]
    serializer_class = EventSerializer

    def get_queryset(self) -> QuerySet[Event]:
        # which objects to get for all views (when we call a view on one object,
        # the object is selected in this list of objects)
        return Event.objects.all()
```

For more details about ViewSet, read the
[Django REST Framework Documentation](https://www.django-rest-framework.org/api-guide/viewsets/).

### The urls

Finally, let's create urls to access our views (we suppose that these urls
are in the `api_urls.py` file of the `event` app).

```python title="api_urls.py"
from rest_framework import routers
from .api_views import EventViewSet

router = routers.DefaultRouter()
router.register('event', EventViewSet, basename='event')
urlpatterns = router.urls
```

So what are the available urls now?

| HTTP Method and URL | View (or action) | Description | (1) | (2) | (3) |
| -- | -- | -- | -- | -- | -- |
| GET `/api/event/event/`           | list      | Get the list of all events defined by the queryset    | ✅ | ❌ | ❌ |
| POST `/api/event/event/`          | create    | Create a new Event object                             | ✅ | ❌ | ✅ |
| GET `/api/event/event/<id>/`      | retrieve  | Get the data of one event by its id                   | ✅ | ✅ | ❌ |
| PUT `/api/event/event/<id>/`      | update    | Modify the data of an event                           | ✅ | ✅ | ✅ |
| DELETE `/api/event/event/<id>/`   | destroy   | Remove the event from the database                    | ✅ | ✅ | ❌ |

* (1) Views that call the `has_permission` method of the Permission class.
* (2) Views that call the `has_object_permission` method of the Permission class.
* (3) Views that call the `validate` method of the Serializer class.

:::tip Custom views
You can also add your custom actions (or views) on a ViewSet: see the
[Django REST Framework documentation](https://www.django-rest-framework.org/api-guide/viewsets/#marking-extra-actions-for-routing).
:::

## How to use an API endpoint

Now, let's see how to use our new API endpoint in a React component:

```tsx title="MyComponent.tsx"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import snakeToCamelCase from '../utils/snakeToCamelCase';

interface Event {
    title: string;
    beginDate: Date;
    endDate: Date;
    isParticipating: boolean;
}

function MyComponent(props: {}): JSX.Element {
    const [ events, setEvents ] = useState<Event[]>([]);
    const [ loadState, setLoadState ] = useState<'load' | 'success' | 'fail'>('load');

    // use useEffect to fetch the API only the first time the component is rendered
    useEffect(() => {
        axios.get<Event[]>('/api/event/event/')
        .then((res) => {
            // get data
            const eventList = res.data;
            // convert the format of the keys from snake_case to camelCase, and convert
            // dates to Date objects (other types are automatically converted)
            snakeToCamelCase(eventList, {beginDate: 'Date', endDate: 'Date'});
            // update the state variables
            setEvents(eventList);
            setLoadState('success');
        })
        .catch(() => setLoadState('fail'));  // if error
    }, []);

    if (loadState === 'load')
        return <p>Chargement en cours... ⏳</p>

    if (loadState === 'fail')
        return <p>Échec du chargement 😢</p>
    
    // render the list of titles of the events
    return (
        <ul>
            {events.map((e) =>
                <li>{e.title}</li>
            )}
        </ul>
    );
}
```

Some explanations on this code:

* First, we declare the imports and interfaces.
* Then, we declare the state variable (`events`) where we will stock the result of the API call.
* Then we call our API with `axios`. We obtain a list like this:
    ```js
    [ { title: 'Title 1', begin_date: '2022-01-01T16:54:000Z', ...}, ...]
    ```
* To respect javascript conventions, we change the format of the keys
    and convert dates from string to Date objects with the `snakeToCamelCase` function:
    ```js
    [ { title: 'Title 1', beginDate: Date('2022-01-01T16:54:000Z'), ...}, ...]
    ```
* And finally we render the data.
