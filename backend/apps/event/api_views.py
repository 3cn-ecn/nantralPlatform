from django.db.models import Q, Count
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Event
from apps.group.models import Group
from .serializers import (EventSerializer, EventParticipatingSerializer)


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

    def get_queryset(self) -> list[Event]:
        """Get all events
        - request : GET event/
        - query params :
            - order_by : list[str] = date ->
            list of attributes to order the result in the form "order=a,b,c".
            In ascending order by defaukt. Add "-" in front of row name without
            spaces to sort by descending order
            - organizer : list[str] = None ->
            the slug list of organizers of the form organizer=a,b,c
            - from_date : 'yyyy-MM-dd' = None ->
            filter event whose date is greater or equal to from_date
            - to_date : 'yyyy-MM-dd' = None ->
            filter event whose date is less or equal to to_date
            - from_date : 'yyyy-MM-dd' = None ->
            filter event whose date is greater or equal to from_date
            - to_date : 'yyyy-MM-dd' = None ->
            filter event whose date is less or equal to to_date
            - min_participants : int = None ->
            lower bound for participants count
            - max_participants : int = None ->
            upper bound for participants count
            - is_member : bool = None ->
            whether user is member of the organizer group
            - is_favorite : bool = None ->
            filter your favorite event
            - is_shotgun : bool = None ->
            filter shotgun events
            - is_form : bool = None ->
            filter events containing a form link
        """
        # query params
        order_by: list[str] = self.request.query_params.get(
            "order_by", "date").split(',')
        organizers_slug: list[str] = self.request.query_params.get(
            "group", "").split(',')
        is_member: bool = self.request.query_params.get("is_member", None)
        is_shotgun: bool = self.request.query_params.get("is_shotgun", None)
        is_form: bool = self.request.query_params.get("is_form", None)
        from_date: str = self.request.query_params.get(
            "from_date", None)
        to_date: str = self.request.query_params.get(
            "to_date", None)
        from_begin_inscription: str = self.request.query_params.get(
            "from_begin_inscription", None)
        to_begin_inscription: str = self.request.query_params.get(
            "to_begin_inscription", None)
        is_favorite: bool = self.request.query_params.get(
            "is_favorite", None)
        is_participating: bool = self.request.query_params.get(
            "is_participating", None)
        min_participants: int = self.request.query_params.get(
            "min_participants", None)
        max_participants: int = self.request.query_params.get(
            "max_participants", None)
        # query
        user_student = self.request.user.student
        user_event_pk = user_student.favorite_event.values('pk')
        my_groups = Group.objects.filter(members=user_student)
        groups: list[Group] = []
        print(organizers_slug)
        try:
            groups = [Group.objects.get(
                slug=slug) for slug in organizers_slug]
        except Group.DoesNotExist:
            groups = []
        # filtering
        events = (
            Event.objects
            .filter(
                Q(group__in=my_groups) if is_member else Q())
            .filter(~Q(max_participant=None) if is_shotgun else Q())
            .filter(Q(participants=user_student) if is_participating else Q())
            .filter(Q(pk__in=user_event_pk) if is_favorite else Q())
            .filter(Q(group__in=groups) if len(groups) > 0 else Q())
            .filter(~Q(form_url=None) if is_form else Q())
            .filter(Q(date__gte=from_date) if from_date else Q())
            .filter(Q(date__lte=to_date) if to_date else Q())
            .filter(Q(begin_inscription__gte=from_begin_inscription)
                    if from_begin_inscription else Q())
            .filter(Q(begin_inscription_date__lte=to_begin_inscription)
                    if to_begin_inscription else Q())
            .annotate(participants_count=Count('participants'))
            .filter(Q(participants_count__gte=min_participants)
                    if min_participants else Q())
            .filter(Q(participants_count__lte=max_participants)
                    if max_participants else Q())
            .order_by(*order_by)
        )

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
