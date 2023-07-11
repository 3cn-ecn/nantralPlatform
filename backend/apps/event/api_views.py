from django.db.models import Q
from django.http.request import QueryDict
from django.utils import formats, timezone
from django.utils.translation import gettext as _

from rest_framework import exceptions, filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.student.serializers import SimpleStudentSerializer
from apps.utils.to_null_bool import to_null_bool

from .models import Event
from .serializers import (EventPreviewSerializer, EventSerializer,
                          EventWriteSerializer)


def format_date(date) -> str:
    return formats.date_format(date, 'DATETIME_FORMAT')


class EventPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj: Event):
        if view.action == 'participants':
            return obj.group.is_admin(request.user)
        if view.action in ('participate', 'bookmark'):
            return obj.can_view(request.user)
        if request.method not in permissions.SAFE_METHODS:
            return obj.group.is_admin(request.user)
        return obj.can_view(request.user)


class EventViewSet(viewsets.ModelViewSet):
    """An API endpoint for event

    Query Parameters
    ----------------
    - ordering : list[str] = start_date
        list of attributes to order the result in the form "order=a,b,c".
        In ascending order by default. Add "-" in front of row name without
        spaces to sort by descending order
    - group : list[str] = None
        the slug list of organizers of the form "organizer=a,b,c"
    - from_date : ISO or UTC date string = None
        filter event whose begin date is greater or equal to from_date
    - to_date : ISO or UTC date string = None
        filter event whose begin date is less or equal to to_date
    - is_member : bool = False
        whether user is member of the organizer group
    - is_bookmarked : bool = False
        filter your favorite event
    - is_shotgun : bool = False
        filter shotgun events
    - is_participating : bool = False
        filter events current user is participating
    - registration_open : bool = None
        whether registration is open or closed

    Actions
    -------
    - GET .../event/ : get the list of event
    - POST .../event/ : create a new event
    - GET .../event/<id>/ : get an event
    - PUT .../event/<id>/ : update an event
    - DELETE .../event/<id>/ : delete an event
    """
    permission_classes = [permissions.IsAuthenticated, EventPermission]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'group__name', 'group__short_name']
    ordering_fields = [
        'created_at',
        'end_date',
        'end_registration'
        'group__name',
        'group__short_name',
        'participants_count',
        'start_date',
        'start_registration',
        'title',
        'updated_at',
    ]
    ordering = ["start_date"]

    @property
    def query_params(self) -> QueryDict:
        return self.request.query_params

    def get_serializer_class(self):
        preview = to_null_bool(self.query_params.get('preview'))
        if self.request.method in ["POST", "PUT", "PATCH"]:
            return EventWriteSerializer
        if preview is True:
            return EventPreviewSerializer
        if preview is False:
            return EventSerializer
        if self.detail:
            return EventSerializer
        return EventPreviewSerializer

    def get_queryset(self) -> list[Event]:
        today = timezone.now()
        user = self.request.user

        # query params
        groups_params = self.query_params.getlist('group', [])
        groups = ','.join(groups_params).split(',') if groups_params else []
        is_member = to_null_bool(self.query_params.get('is_member'), False)
        is_shotgun = to_null_bool(self.query_params.get('is_shotgun'), False)
        is_bookmarked = to_null_bool(
            self.query_params.get('is_bookmarked'), False)
        is_participating = self.query_params.get('is_participating', False)
        registration_open = to_null_bool(self.query_params.get('registration'))
        from_date = self.query_params.get('from_date')
        to_date = self.query_params.get('to_date')

        # filtering
        qs = Event.objects.filter(
            Q(publicity='Pub') | Q(group__members=user.student))
        if is_member:
            qs = qs.filter(group__members=user.student)
        if is_shotgun:
            qs = qs.filter(max_participant__isnull=False)
        if is_participating:
            qs = qs.filter(participants=user.student)
        if is_bookmarked:
            qs = qs.filter(bookmarks=user.student)
        if len(groups) > 0:
            qs = qs.filter(group__slug__in=groups)
        if from_date:
            qs = qs.filter(end_date__gte=from_date)
        if to_date:
            qs = qs.filter(start_date__lte=to_date)
        if registration_open is not None:
            qs = (qs
                  .annotate(registration_open=(
                      (Q(start_registration__lte=today)
                       | Q(start_registration__isnull=True))
                      & (Q(end_registration__gte=today)
                         | Q(end_registration__isnull=True))
                  ))
                  .filter(registration_open=registration_open))
        return qs.distinct()

    @action(detail=True, filter_backends=[])
    def participants(self, request, pk=None):
        event: Event = self.get_object()
        page = self.paginate_queryset(event.participants.all())
        serializer = SimpleStudentSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=True, methods=['POST', 'DELETE'])
    def participate(self, request, pk=None):
        """
        A view to add the user to the list of participants or remove him/her \
        from the list.
        """
        event: Event = self.get_object()
        # user asks to remove himself from participants
        if request.method == 'DELETE':
            event.participants.remove(request.user.student)
            return Response(status=status.HTTP_204_NO_CONTENT)
        # user asks to add himself to participants
        now = timezone.now()
        if event.start_registration and event.start_registration > now:
            raise exceptions.PermissionDenied(
                _("Too soon! Registration will start at %(datetime)s.")
                % {'datetime': format_date(event.start_registration)})
        if event.end_registration and event.end_registration < now:
            raise exceptions.PermissionDenied(
                _("Too late! Registration has ended at %(datetime)s.")
                % {'datetime': format_date(event.end_registration)})
        if (event.max_participant
                and event.participants.count() >= event.max_participant):
            raise exceptions.PermissionDenied(
                _("Too late! The maximum number of participants "
                  "have been reached."))
        # if we pass all criteria, add the user
        event.participants.add(request.user.student)
        return Response(status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['POST', 'DELETE'])
    def bookmark(self, request, pk=None):
        """
        A view to add or remove this event to the bookmarks of the user.
        """
        event: Event = self.get_object()
        if request.method == 'DELETE':
            event.bookmarks.remove(request.user.student)
            return Response(status=status.HTTP_204_NO_CONTENT)
        event.bookmarks.add(request.user.student)
        return Response(status=status.HTTP_201_CREATED)
