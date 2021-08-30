from datetime import datetime

from rest_framework import generics, permissions

from .models import BaseEvent
from .serializers import *


class ListEventsHomeAPIView(generics.ListAPIView):
    """List all events for a user depending on the chosen
    time window. By default only returns current events."""
    serializer_class = BaseEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        events = BaseEvent.objects.filter(
            date__gte=datetime.today()).order_by("date")
        return [event for event in events if event.can_view(
            self.request.user)]

    def get_serializer_context(self):
        context = super(ListEventsHomeAPIView, self).get_serializer_context()
        context.update({"request": self.request})
        return context


class ListEventsParticipantsAPIView(generics.ListAPIView):
    """List the persons participating to an event.
    Only allowed to members of the group to which the event belongs."""
    serializer_class = EventParticipatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        eventSlug = self.kwargs['event_slug']
        event = BaseEvent.objects.get(slug=eventSlug)
        group = event.get_group
        if group.is_admin(user):
            return event.participants
        return []


class ListEventsGroupAPIView(generics.ListAPIView):
    """List events for a group depending on the chosen
    time window. By default only returns current events."""
    serializer_class = BaseEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.method == 'GET':
            if self.request.GET.get('view') == 'archives':
                return BaseEvent.objects.filter(group=self.kwargs['group'], date__lt=datetime.today())
            elif self.request.GET.get('view') == 'all':
                return BaseEvent.objects.filter(group=self.kwargs['group'])
        return BaseEvent.objects.filter(group=self.kwargs['group'], date__gte=datetime.today())


class UpdateEventAPIView(generics.RetrieveDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BaseEventSerializer
    lookup_field = 'slug'
    lookup_url_kwarg = 'event_slug'

    def get_queryset(self):
        return BaseEvent.objects.filter(slug=self.kwargs['event_slug'])
