from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

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
            group=self.kwargs['group'], date__gte=date_gte)


class ParticipateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        event = get_object_or_404(Event, slug=self.kwargs['event_slug'])
        inscription_finished: bool = event.end_inscription is not None and\
            timezone.now() > event.end_inscription
        inscription_not_started: bool = event.begin_inscription is not None and\
            timezone.now() < event.begin_inscription
        shotgun: bool = event.max_participant is not None
        print(inscription_finished)
        if inscription_not_started:
            return Response(
                status='401',
                data={"success": False,
                      "message": "Inscription not started"})
        elif inscription_finished:
            return Response(
                status='401',
                data={"success": False,
                      "message": "Inscription finished"})
        elif shotgun and event.max_participant <= event.number_of_participants:
            return Response(
                status='401',
                data={"success": False,
                      "message": "Shotgun full"})
        else:
            event.participants.add(request.user.student)
            return Response(
                status='200',
                data={"success": True,
                      "message": "You have been added to this event"})

    def delete(self, request, *args, **kwargs):
        event = get_object_or_404(Event, slug=self.kwargs['event_slug'])
        event.participants.remove(request.user.student)
        return Response(
            status='200',
            data={
                "success": True,
                "message": "You have been removed from this event"
            })


class FavoriteAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        event = get_object_or_404(Event, slug=self.kwargs['event_slug'])
        student = request.user.student
        if (student is None):
            return Response(status='404', data={
                "success": False,
                "message": "Couldn\'t find student"
            })
        else:
            student.favorite_event.add(event)
            return Response(status='200', data={
                "success": True,
                "message": "You have added this event to your favorites"
            })

    def delete(self, request, *args, **kwargs):
        event = get_object_or_404(Event, slug=self.kwargs['event_slug'])
        student = request.user.student
        if (student is None):
            return Response(status='404', data={
                "success": False,
                "message": "Couldn\'t find student"
            })
        else:
            student.favorite_event.remove(event)
            return Response(status='200', data={
                "success": True,
                "message": "You have added this event to your favorites"
            })
