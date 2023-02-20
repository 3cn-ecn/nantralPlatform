from django.utils import timezone

from rest_framework import generics, permissions

from .models import Event
from .serializers import EventSerializer, EventParticipatingSerializer


class ListEventsHomeAPIView(generics.ListAPIView):
    """List all events for a user depending on the chosen
    time window. By default only returns current events."""
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        today = timezone.now()
        events = Event.objects.filter(date__gte=today).order_by("date")
        print(events.count())
        return [e for e in events if e.can_view(self.request.user)]


class ListAllEventsGroupAPIView(generics.ListAPIView):
    """List all events for a group depending on the chosen
    time window. By default only returns current events."""
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        group = self.kwargs["group"]
        today = timezone.now()
        events = Event.objects.filter(
            group_slug=group,
            date__gte=today).order_by("date")
        return [e for e in events if e.can_view(self.request.user)]


class ListEventsParticipantsAPIView(generics.ListAPIView):
    """List the persons participating to an event.
    Only allowed to members of the group to which the event belongs."""
    serializer_class = EventParticipatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        event_slug = self.kwargs['event_slug']
        event = Event.objects.get(slug=event_slug)
        group = event.group
        if group.is_admin(user):
            return event.participants
        return []


class ListEventsGroupAPIView(generics.ListAPIView):
    """List events for a group depending on the chosen
    time window. By default only returns current events."""
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.method == 'GET':
            if self.request.GET.get('view') == 'archives':
                date_lt = timezone.make_aware(timezone.now().today())
                return Event.objects.filter(
                    group_slug=self.kwargs['group'], date__lt=date_lt)
            elif self.request.GET.get('view') == 'all':
                return Event.objects.filter(group_slug=self.kwargs['group'])
        date_gte = timezone.make_aware(timezone.now().today())
        return Event.objects.filter(
            group_slug=self.kwargs['group'], date__gte=date_gte)
