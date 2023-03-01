from django.db.models import Q
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Event
from apps.group.models import Group
from .serializers import (EventSerializer, EventParticipatingSerializer,
                          PostEventSerializer)


class EventPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj: Event):
        if request.method in permissions.SAFE_METHODS:
            return obj.can_view(request.user)
        else:
            admin: bool = obj.group.is_admin(request.user)
            if admin is None:
                return False
            return admin

    def has_permission(self, request, view):
        return True


class EventListViewSet(viewsets.ModelViewSet):
    """An API endpoint for events."""

    permission_classes = [permissions.IsAuthenticated, EventPermission]
    serializer_class = EventSerializer
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'
    # search_fields = ['name', 'short_name']

    def get_serializer_class(self):
        if self.request.method in permissions.SAFE_METHODS:
            return EventSerializer
        else:
            return PostEventSerializer

    def get_queryset(self) -> list[Event]:
        """Get all events
        - request : GET event/
        - query params :
            - order : list[str] = date ->
            list of attributes to order results in the form of order=a,b,...
            - is_member : bool = None ->
            whether user is member of the organizer group
            - from_date : 'yyyy-MM-ddz' = today ->
            filter begin_date of the event from this date
            - to_date : 'yyyy-MM-dd' = None ->
            filter begin_date of the event to this date
            - favorite : bool = None ->
            filter 

        """
        # query params
        order: list[str] = self.request.query_params.get(
            "order", "date").split(',')
        member: bool = self.request.query_params.get("is_member", None)
        shotgun: bool = self.request.query_params.get("shotgun", None)
        from_date: str = self.request.query_params.get(
            "from_date", timezone.now())
        to_date: str = self.request.query_params.get(
            "to_date", None)
        favorite: bool = self.request.query_params.get(
            "favorite", None)
        # query
        user_event_pk = self.request.user.student.favorite_event.values('pk')
        events = (
            Event.objects
            .filter(
                Q(group__members=self.request.user) if member else Q())
            .filter(~Q(max_participant=None) if shotgun else Q())
            .filter(Q(pk__in=user_event_pk) if favorite else Q())
            .order_by(*order)
        )
        if from_date is not None and to_date is None:
            events = events.filter(date__gte=from_date)
        elif from_date is None and to_date is not None:
            events = events.filter(date__lte=to_date)
        elif from_date is not None and to_date is not None:
            events = events.filter(date__range=[from_date, to_date])
        return [e for e in events if e.can_view(self.request.user)]

    def get_object(self) -> Event:
        """Get event details
        - request : GET event/<event_slug>"""
        event = get_object_or_404(
            Event, slug=self.kwargs["slug"])
        return event

    def create(self, request, *args, **kwargs):
        """Create a new event. You have to be admin of the club to create
        an event
        - request : POST event/"""
        # Check if user is admin of the club to create a new event
        group = get_object_or_404(Group, pk=request.data.get("group"))
        if group.is_admin(self.request.user):
            return super().create(request, *args, **kwargs)
        return Response(status=403,
                        data={"detail": "You are not admin of this club"})


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


class ListEventsParticipantsAPIView(viewsets.ViewSet):
    """List the persons participating to an event.
    Only allowed to members of the group to which the event belongs."""
    serializer_class = EventParticipatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        user = self.request.user
        event_slug = kwargs['event_slug']
        event = Event.objects.get(slug=event_slug)
        group = event.group
        if group.is_admin(user):
            serializer = EventParticipatingSerializer(
                event.participants, many=True)
            return Response(serializer.data)
        return Response(status=403,
                        data={"detail": "You are not admin of this club"})


class ListEventsGroupAPIView(viewsets.ViewSet):
    """List events for a group depending on the chosen
    time window. By default only returns current events."""
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self):
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
