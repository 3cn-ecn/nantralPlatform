from django.db.models import Q, Count
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import (
    pagination,
    permissions,
    viewsets)

from apps.post.models import VISIBILITY
from .models import Event
from apps.student.models import Student
from apps.group.models import Group
from .serializers import (EventSerializer, EventParticipatingSerializer)
from apps.student.serializers import StudentSerializer, SimpleStudentSerializer


class EventPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj: Event):
        if request.method in permissions.SAFE_METHODS:
            return obj.can_view(request.user)
        else:
            return obj.group.is_admin(request.user)


ORDERS: list[str] = ['participants_count',
                     'form_url',
                     'publicity',
                     'date',
                     'end_date',
                     'begin_registration',
                     'end_registration',
                     'slug',
                     'group_name',
                     'max_participant',
                     'location',
                     'title']

DATE_FIELDS: list[str] = ['end_date', 'date',
                          'begin_registration', 'end_registration']


TRUE_ARGUMENTS: list[str] = ['true', 'True', '1']


class EventViewSet(viewsets.ModelViewSet):
    """An API endpoint for event

    Query Parameters
    ----------------
    - limit : int = 50 ->
    maximum number of results
    - order_by : list[str] = date ->
    list of attributes to order the result in the form "order=a,b,c".
    In ascending order by defaut. Add "-" in front of row name without
    spaces to sort by descending order
    - group : list[str] = None ->
    the slug list of organizers of the form "organizer=a,b,c"
    - from_date : ISO or UTC datestring = None ->
    filter event whose begin date is greater or equal to from_date
    - to_date : ISO or UTC datestring = None ->
    filter event whose begin date is less or equal to to_date
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
    - is_participating : bool = None ->
    filter events current user is participating
    - publicity : 'Mem' | 'Pub' = None ->
    visibility of the event
    - registration : 'open' | 'closed' = None ->
    whether registration is open

    Actions
    -------
    - GET .../event/ : get the list of event
    - POST .../event/ : create a new event
    - GET .../event/<id>/ : get an event
    - PUT .../event/<id>/ : update an event
    - DELETE .../event/<id>/ : delete an event
    """
    permission_classes = [permissions.IsAuthenticated, EventPermission]
    serializer_class = EventSerializer
    pagination_class = pagination.LimitOffsetPagination

    def get_queryset(self) -> list[Event]:
        if not hasattr(self.request.user, 'student'):
            return []
        # constant
        today = timezone.now()
        # query params
        order_by: list[str] = self.request.query_params.get(
            'order_by', 'date').split(',')
        groups: str = self.request.query_params.get('group')
        organizers_slug: list[str] = groups.split(',') if groups else []
        is_member: bool = self.request.query_params.get(
            'is_member') in TRUE_ARGUMENTS
        is_shotgun: bool = self.request.query_params.get(
            'is_shotgun') in TRUE_ARGUMENTS
        registration: str = self.request.query_params.get(
            'registration')
        is_form: bool = self.request.query_params.get(
            'is_form') in TRUE_ARGUMENTS
        is_favorite: bool = self.request.query_params.get(
            'is_favorite') in TRUE_ARGUMENTS
        is_participating: bool = self.request.query_params.get(
            'is_participating') in TRUE_ARGUMENTS
        from_date: str = self.request.query_params.get(
            'from_date')
        to_date: str = self.request.query_params.get(
            'to_date')
        min_participants: int = self.request.query_params.get(
            'min_participants')
        max_participants: int = self.request.query_params.get(
            'max_participants')
        visibility: str = self.request.query_params.get('publicity')
        # query
        order_by = filter(lambda ord: ord in ORDERS or (
            ord[0] == '-' and ord[1:]) in ORDERS, order_by)
        student: Student = self.request.user.student
        my_groups = Group.objects.filter(members=student)
        user_event_pk = student.favorite_event.values('pk')
        # filtering
        events = (
            Event.objects
            .annotate(member=Q(group__in=my_groups))
            .filter(
                Q(member=True) if is_member else Q())
            .filter(~Q(max_participant=None) if is_shotgun else Q())
            .filter(Q(participants=student)
                    if is_participating else Q())
            .filter(Q(pk__in=user_event_pk) if is_favorite else Q())
            .filter(Q(group__slug__in=organizers_slug)
                    if len(organizers_slug) > 0 else Q())
            .filter(~Q(form_url__isnull=True) if is_form else Q())
            .filter(Q(end_date__gte=from_date)
                    if from_date else Q())
            .filter(Q(date__lte=to_date) if to_date else Q())
            .annotate(participants_count=Count('participants'))
            .filter(Q(participants_count__gte=min_participants)
                    if min_participants else Q())
            .filter(Q(participants_count__lte=max_participants)
                    if max_participants else Q())
            .annotate(registration_open=(
                (Q(begin_registration__lte=today)
                 | Q(begin_registration__isnull=True))
                & (Q(end_registration__gte=today)
                   | Q(end_registration__isnull=True))
            ))
            .filter(Q(registration_open=True)
                    if registration == "open" else Q())
            .filter(Q(registration_open=False)
                    if registration == "closed" else Q())
            .filter(Q(publicity=visibility) if visibility in
                    [VISIBILITY[i][0] for i in range(len(VISIBILITY))] else Q())
            .filter(Q(publicity=VISIBILITY[0][0]) | Q(member=True))
            .order_by(*order_by)
            .distinct()
        )
        return events


class ListEventsParticipantsAPIView(viewsets.ViewSet):
    """List the persons participating to an event.
    Only allowed to members of the group to which the event belongs.7

    Query Parameters
    ----------------
    - simple : bool = false ->
    Simple student format

    Actions
    -------
    - GET .../event/<id>/participants"""
    serializer_class = EventParticipatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        simple: bool = request.query_params.get('simple')
        user = self.request.user
        event = get_object_or_404(Event, id=self.kwargs['event_id'])
        group = event.group
        if group.is_admin(user):
            if simple:
                serializer = SimpleStudentSerializer(
                    event.participants, many=True)
            else:
                serializer = StudentSerializer(
                    event.participants, many=True)
            return Response(serializer.data)
        return Response(status=403,
                        data={"detail": "You are not admin of this club"})


class ParticipateAPIView(APIView):
    """
    Actions
    -------
    - POST .../event/<id>/participate : participate to an event
    - DELETE .../event/<id>/participate : remove participation of an event
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        event = get_object_or_404(Event, id=self.kwargs['event_id'])
        registration_finished: bool = (
            event.end_registration is not None
            and timezone.now() > event.end_registration)
        registration_not_started: bool = (
            event.begin_registration is not None
            and timezone.now() < event.begin_registration)
        shotgun: bool = event.max_participant is not None
        if registration_not_started:
            return Response(
                status='401',
                data={"success": False,
                      "message": "Registration not started"})
        elif registration_finished:
            return Response(
                status='401',
                data={"success": False,
                      "message": "Registration finished"})
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
        event = get_object_or_404(Event, id=self.kwargs['event_id'])
        event.participants.remove(request.user.student)
        return Response(
            status='200',
            data={
                "success": True,
                "message": "You have been removed from this event"
            })


class FavoriteAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    """
    Actions
    -------
    - POST .../event/<id>/favorite : add event to your favorites
    - DELETE .../event/<id>/favorite : remove event to your favorites
    """

    def post(self, request, *args, **kwargs):
        event = get_object_or_404(Event, id=self.kwargs['event_id'])
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
        event = get_object_or_404(Event, id=self.kwargs['event_id'])
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
