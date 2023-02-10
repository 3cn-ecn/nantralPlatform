from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import BaseEvent
from .serializers import BaseEventSerializer, EventParticipatingSerializer


class ListEventsHomeAPIView(generics.ListAPIView):
    """List all events for a user depending on the chosen
    time window. By default only returns current events."""
    serializer_class = BaseEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        date_gte = timezone.make_aware(timezone.now().today())
        events = BaseEvent.objects.filter(
            # If we don't do this, it throws a RunTimeWarning for some reason
            date__gte=date_gte).order_by("date")
        return [event for event in events if event.can_view(
            self.request.user)]

    def get_serializer_context(self):
        context = super(ListEventsHomeAPIView, self).get_serializer_context()
        context.update({"request": self.request})
        return context


class ListAllEventsGroupAPIView(generics.ListAPIView):
    """List all events for a group depending on the chosen
    time window. By default only returns current events."""
    serializer_class = BaseEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        group = self.kwargs["group"]
        date_gte = timezone.make_aware(timezone.now().today())
        events = BaseEvent.objects.filter(
            group=group,
            date__gte=date_gte).order_by("date")
        return [event for event in events if event.can_view(
            self.request.user)]

    def get_serializer_context(self):
        context = super(ListAllEventsGroupAPIView,
                        self).get_serializer_context()
        context.update({"request": self.request})
        return context


class ListEventsParticipantsAPIView(generics.ListAPIView):
    """List the persons participating to an event.
    Only allowed to members of the group to which the event belongs."""
    serializer_class = EventParticipatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        event_slug = self.kwargs['event_slug']
        event = BaseEvent.objects.get(slug=event_slug)
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
                date_lt = timezone.make_aware(timezone.now().today())
                return BaseEvent.objects.filter(
                    group=self.kwargs['group'], date__lt=date_lt)
            elif self.request.GET.get('view') == 'all':
                return BaseEvent.objects.filter(group=self.kwargs['group'])
        date_gte = timezone.make_aware(timezone.now().today())
        return BaseEvent.objects.filter(
            group=self.kwargs['group'], date__gte=date_gte)


class UpdateEventAPIView(generics.RetrieveDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BaseEventSerializer
    lookup_field = 'slug'
    lookup_url_kwarg = 'event_slug'

    def get_queryset(self):
        return BaseEvent.objects.filter(slug=self.kwargs['event_slug'])


class ParticipateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        event = get_object_or_404(BaseEvent, slug=self.kwargs['event_slug'])
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
        event = get_object_or_404(BaseEvent, slug=self.kwargs['event_slug'])
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
        event = get_object_or_404(BaseEvent, slug=self.kwargs['event_slug'])
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
        event = get_object_or_404(BaseEvent, slug=self.kwargs['event_slug'])
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
