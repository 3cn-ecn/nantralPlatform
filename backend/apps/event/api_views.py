from django.db.models import Q, QuerySet
from django.http.request import QueryDict
from django.utils import formats, timezone
from django.utils.translation import gettext as _

from rest_framework import exceptions, filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.student.serializers import StudentPreviewSerializer
from apps.utils.parse import parse_bool

from .models import Event
from .serializers import (
    EventPreviewSerializer,
    EventSerializer,
    EventWriteSerializer,
)


def format_date(date) -> str:
    """Format and translate a date according to the locale."""
    return formats.date_format(date, "DATETIME_FORMAT")


class EventPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj: Event):
        if request.method not in permissions.SAFE_METHODS:
            if view.action in ("participate", "bookmark"):
                return obj.can_view(request.user)
            return obj.group.is_admin(request.user)
        return obj.can_view(request.user)


class EventViewSet(viewsets.ModelViewSet):
    """An API endpoint for event.

    Query Parameters
    ----------------
    - ordering: str = "start_date"
        List of fields to order by, separated by ','. Prefix a field by '-' to
        use descending order.
    - search: str
        search through all events
    - preview: bool
        limit the query to some fields
    - group: str (accepted multiple times)
        Filter by an organizing group slug
    - from_date: ISO or UTC date string = None
        filter event whose begin date is greater or equal to from_date
    - to_date: ISO or UTC date string = None
        filter event whose begin date is less or equal to to_date
    - is_member: bool = None
        whether user is member of the organizer group
    - is_bookmarked: bool = None
        filter your favorite event
    - is_shotgun: bool = None
        filter shotgun events
    - is_participating: bool = None
        filter events current user is participating
    - is_registration_open: bool = None
        whether registration is open or closed
    - page: int
        the index of the page
    - page_size: int
        the number of events per page

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
    search_fields = ["title", "group__name", "group__short_name"]
    ordering_fields = [
        "created_at",
        "end_date",
        "end_registration",
        "group__name",
        "group__short_name",
        "participants_count",
        "start_date",
        "start_registration",
        "title",
        "updated_at",
    ]
    ordering = ["start_date"]

    @property
    def query_params(self) -> QueryDict:
        return self.request.query_params

    def get_serializer_class(self):
        preview = parse_bool(self.query_params.get("preview"))
        if self.request.method in ["POST", "PUT", "PATCH"]:
            return EventWriteSerializer
        if preview is True:
            return EventPreviewSerializer
        if preview is False:
            return EventSerializer
        if self.detail:
            return EventSerializer
        return EventPreviewSerializer

    def get_queryset(self) -> QuerySet[Event]:  # noqa: C901
        now = timezone.now()
        user = self.request.user

        # query params
        group_params = self.query_params.getlist("group", [])
        groups = ",".join(group_params).split(",") if group_params else []
        is_member = parse_bool(self.query_params.get("is_member"))
        is_shotgun = parse_bool(self.query_params.get("is_shotgun"))
        is_bookmarked = parse_bool(self.query_params.get("is_bookmarked"))
        is_participating = parse_bool(self.query_params.get("is_participating"))
        is_registration_open = parse_bool(
            self.query_params.get("is_registration_open"),
        )
        from_date = self.query_params.get("from_date")
        to_date = self.query_params.get("to_date")

        # filtering
        qs = Event.objects.filter(
            Q(publicity="Pub") | Q(group__members=user),
        )
        if len(groups) > 0:
            qs = qs.filter(group__slug__in=groups)
        if from_date:
            qs = qs.filter(end_date__gte=from_date)
        if to_date:
            qs = qs.filter(start_date__lte=to_date)
        if is_member is True:
            qs = qs.filter(group__members=user)
        if is_member is False:
            qs = qs.exclude(group__members=user)
        if is_participating is True:
            qs = qs.filter(participants=user)
        if is_participating is False:
            qs = qs.exclude(participants=user)
        if is_bookmarked is True:
            qs = qs.filter(bookmarks=user)
        if is_bookmarked is False:
            qs = qs.exclude(bookmarks=user)
        if is_shotgun is True:
            qs = qs.filter(
                Q(max_participant__isnull=False)
                | Q(start_registration__isnull=False)
                | Q(end_registration__isnull=False),
            )
        if is_shotgun is False:
            qs = qs.exclude(
                Q(max_participant__isnull=False)
                | Q(start_registration__isnull=False)
                | Q(end_registration__isnull=False),
            )
        if is_registration_open is not None:
            condition = (
                Q(start_registration__lte=now)
                | Q(start_registration__isnull=True)
            ) & (
                Q(end_registration__gte=now) | Q(end_registration__isnull=True)
            )
            qs = qs.filter(condition if is_registration_open else ~condition)

        return qs.select_related("group").distinct()

    @action(detail=True, filter_backends=[])
    def participants(self, request, pk=None):
        event: Event = self.get_object()
        page = self.paginate_queryset(event.participants.all())
        serializer = StudentPreviewSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=True, methods=["POST", "DELETE"])
    def participate(self, request, pk=None):
        """Add or remove a user from the participants."""
        event: Event = self.get_object()
        # user asks to remove himself from participants
        if request.method == "DELETE":
            event.participants.remove(request.user)
            return Response(status=status.HTTP_204_NO_CONTENT)
        # user asks to add himself to participants
        now = timezone.now()
        if event.start_registration and event.start_registration > now:
            raise exceptions.PermissionDenied(
                _("Too soon! Registration will start at %(datetime)s.")
                % {"datetime": format_date(event.start_registration)},
            )
        if event.end_registration and event.end_registration < now:
            raise exceptions.PermissionDenied(
                _("Too late! Registration has ended at %(datetime)s.")
                % {"datetime": format_date(event.end_registration)},
            )
        if (
            event.max_participant
            and event.participants.count() >= event.max_participant
        ):
            raise exceptions.PermissionDenied(
                _(
                    "Too late! The maximum number of participants "
                    "have been reached.",
                ),
            )
        # if we pass all criteria, add the user
        event.participants.add(request.user)
        return Response(status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["POST", "DELETE"])
    def bookmark(self, request, pk=None):
        """A view to add or remove this event to the bookmarks of the user."""
        event: Event = self.get_object()
        if request.method == "DELETE":
            event.bookmarks.remove(request.user)
            return Response(status=status.HTTP_204_NO_CONTENT)
        event.bookmarks.add(request.user)
        return Response(status=status.HTTP_201_CREATED)
