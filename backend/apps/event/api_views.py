from django.utils import timezone

from rest_framework import generics, permissions

from .models import BaseEvent
from .serializers import BaseEventSerializer, EventParticipatingSerializer


class ListEventsHomeAPIView(generics.ListAPIView):
    """List all events for a user depending on the chosen
    time window. By default only returns current events."""
    serializer_class = BaseEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        today = timezone.now()
        events = BaseEvent.objects.filter(date__gte=today).order_by("date")
        print(events.count())
        return [e for e in events if e.can_view(self.request.user)]


class ListAllEventsGroupAPIView(generics.ListAPIView):
    """List all events for a group depending on the chosen
    time window. By default only returns current events."""
    serializer_class = BaseEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        group = self.kwargs["group"]
        today = timezone.now()
        events = BaseEvent.objects.filter(
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
        event = BaseEvent.objects.get(slug=event_slug)
        group = event.group
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
                date_lt = timezone.make_aware(timezone.now().today())
                return BaseEvent.objects.filter(
                    group_slug=self.kwargs['group'], date__lt=date_lt)
            elif self.request.GET.get('view') == 'all':
                return BaseEvent.objects.filter(group_slug=self.kwargs['group'])
        date_gte = timezone.make_aware(timezone.now().today())
        return BaseEvent.objects.filter(
            group_slug=self.kwargs['group'], date__gte=date_gte)


class UpdateEventAPIView(generics.RetrieveDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BaseEventSerializer
    lookup_field = 'slug'
    lookup_url_kwarg = 'event_slug'

    def get_queryset(self):
        return BaseEvent.objects.filter(slug=self.kwargs['event_slug'])
