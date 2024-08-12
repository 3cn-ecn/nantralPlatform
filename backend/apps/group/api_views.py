from django.db.models import Count, F, Q, QuerySet
from django.http.request import QueryDict
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.utils.translation import gettext as _

from requests import Request
from rest_framework import (
    decorators,
    exceptions,
    filters,
    permissions,
    response,
    serializers,
    status,
    viewsets,
)

from apps.utils.discord import respond_admin_request, send_admin_request
from apps.utils.parse_bool import parse_bool

from .models import Group, GroupType, Label, Membership
from .permissions import (
    AdminRequestListPermission,
    AdminRequestPermission,
    GroupPermission,
    MembershipPermission,
)
from .serializers import (
    AdminRequestFormSerializer,
    AdminRequestSerializer,
    GroupPreviewSerializer,
    GroupSerializer,
    GroupTypeSerializer,
    GroupWriteSerializer,
    LabelSerializer,
    MembershipSerializer,
    NewMembershipSerializer,
)


class GroupTypeViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = GroupTypeSerializer
    lookup_field = "slug"
    lookup_url_kwarg = "slug"
    queryset = GroupType.objects.all()


class GroupViewSet(viewsets.ModelViewSet):
    """An API endpoint for groups.

    Query Parameters
    ----------------
    - type: slug
        Filter by group type
    - is_member: bool
        Filter by groups where user is member
    - is_admin: bool
        Filter by groups where user is an admin member
    - slug: string (multiple)
        Filter by one or multiple slug
    - page: int
        The page to get
    - pageSize: int
        The max number of items to return per page
    - parent: string (multiple)
        Filter by one or multiple parent group slug

    Actions
    -------
    GET .../group/ : get the list of groups
    POST .../group/ : create a new group (group_type required)
    GET .../group/search/ : search a group by name or short_name
    GET .../group/<id>/ : get a group
    PUT .../group/<id>/ : update a group
    DELETE .../group/<id>/ : delete a group
    """

    permission_classes = [GroupPermission]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "short_name", "slug"]
    lookup_field = "slug"
    lookup_url_kwarg = "slug"

    @property
    def query_params(self) -> QueryDict:
        return self.request.query_params

    def get_serializer_class(self):
        preview = parse_bool(self.query_params.get("preview"))
        if self.request.method in ["POST", "PUT", "PATCH"]:
            return GroupWriteSerializer
        if preview is True:
            return GroupPreviewSerializer
        if preview is False:
            return GroupSerializer
        if self.detail:
            return GroupSerializer
        return GroupPreviewSerializer

    def get_queryset(self) -> QuerySet[Group]:
        user = self.request.user
        group_type = GroupType.objects.filter(
            slug=self.query_params.get("type"),
        ).first()
        is_member = parse_bool(
            self.query_params.get("is_member"), default=False
        )
        is_admin = parse_bool(self.query_params.get("is_admin"), default=False)
        has_no_parent = parse_bool(
            self.query_params.get("has_no_parent"), default=False
        )
        slugs = self.query_params.getlist("slug")
        parents = self.query_params.getlist("parent")

        queryset = (
            Group.objects
            # remove the sub-groups to keep only parent groups
            .filter(
                Q(parent=None) | Q(parent__in=F("group_type__extra_parents")),
            )
            # hide archived groups
            .filter(archived=False)
            # hide groups without active members (ie end_date > today)
            .annotate(
                num_active_members=Count(
                    "membership_set",
                    filter=Q(membership_set__end_date__gte=timezone.now()),
                ),
            )
            .filter(
                Q(num_active_members__gt=0)
                | Q(group_type__hide_no_active_members=False),
            )
        )
        if has_no_parent:
            queryset = queryset.filter(parent=None)
        # hide private groups unless user is member
        if user.is_authenticated:
            queryset = queryset.filter(
                Q(private=False) | Q(members=user.student),
            )
        # and hide non-public group if user is not authenticated
        else:
            queryset = queryset.filter(public=True)
        # filter by group_type
        if group_type:
            queryset = queryset.filter(group_type=group_type)
        # filter by groups where current user is member
        if is_member:
            queryset = queryset.filter(members=user.student)
        # filter by groups where current user is admin
        if is_admin:
            queryset = queryset.filter(
                membership_set__student=user.student,
                membership_set__admin=True,
            )
        # filter by slug
        if slugs:
            queryset = queryset.filter(slug__in=slugs)
        # filter by parent
        if parents:
            queryset = queryset.filter(parent__slug__in=parents)

        return (
            queryset
            # prefetch type and parent group for better performances
            .prefetch_related("group_type", "parent")
            # order by category, order and then name
            .order_by(
                "group_type",
                *group_type.sort_fields.split(",") if group_type else "",
            )
            .distinct()
        )

    def get_object(self):
        obj = get_object_or_404(Group, slug=self.kwargs["slug"])
        self.check_object_permissions(self.request, obj)
        return obj


class MembershipViewSet(viewsets.ModelViewSet):
    """An API viewset to get memberships of a group. This viewset ignore all
    logic related with admin requests.

    Query Params
    ------------
    student: id
        The student id
    group: str
        The group slug
    from: Date
        The date from which we want to filter the member list
    to: Date
        The date to which we want to filter the member list
    page: int
        The page to get
    pageSize: int
        The max number of items to return per page

    Actions
    -------
    GET .../membership/ : list all memberships
    POST .../membership/ : create a new membership
    GET .../membership/search/ : search a membership by group or student name
    GET .../membership/<id>/ : get a membership details
    PUT .../membership/<id>/ : update a membership
    DELETE .../membership/<id>/ : delete a membership object
    """

    permission_classes = [permissions.IsAuthenticated, MembershipPermission]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "student__user__first_name",
        "student__user__last_name",
        "group__name",
        "group__short_name",
        "summary",
    ]
    ordering_fields = ["begin_date", "end_date", "priority", "admin"]
    ordering = [
        "-priority",
        "student__user__first_name",
        "student__user__last_name",
    ]

    @property
    def query_params(self) -> QueryDict:
        return self.request.query_params

    def get_serializer_class(self) -> serializers.ModelSerializer:
        if self.action == "create":
            return NewMembershipSerializer
        elif self.action in ["admin_request", "accept_request", "deny_request"]:
            return super().get_serializer_class()
        else:
            return MembershipSerializer

    # simply to override the return type
    def get_serializer(self, *args, **kwargs) -> serializers.Serializer:
        return super().get_serializer(*args, **kwargs)

    def get_queryset(self) -> QuerySet[Membership]:
        """
        Get list of memberships filtered by query params.
        Used by list, retrieve, update, partial_update and destroy actions.
        """
        if self.queryset:
            return self.queryset
        user = self.request.user
        # parse params
        from_date = parse_datetime(self.query_params.get("from", ""))
        to_date = parse_datetime(self.query_params.get("to", ""))
        group_slug = self.query_params.get("group")
        student_id = self.query_params.get("student")
        # make queryset
        qs = Membership.objects.all()
        # filter by memberships you are allowed to see
        if not user.is_superuser:
            qs = qs.filter(
                Q(group__private=False) | Q(group__members=user.student),
            )
        # filter by params
        if group_slug:
            qs = qs.filter(group__slug=group_slug)
        if student_id:
            qs = qs.filter(student__id=student_id)
        if from_date:
            qs = qs.filter(
                Q(end_date__gte=from_date) | Q(end_date__isnull=True),
            )
        if to_date:
            qs = qs.filter(Q(end_date__lt=to_date) | Q(begin_date__isnull=True))
        if self.action == "admin_requests":
            qs = qs.filter(admin_request=True)

        qs = qs.prefetch_related("student__user").distinct()
        self.queryset = qs
        return qs

    @decorators.action(detail=False, methods=["POST"])
    def reorder(self, request, *args, **kwargs):
        """
        Action to reorder a membership. It changes the `priority` fields for all
        members of a group to place the member between two other members, in the
        list of memberships defined by the query parameters.

        ## Body Parameters
        member: id of the membership we want to move elsewhere
        lower: id of the membership that should be just before the member,
               for the given query parameters, or None if member should be the
               last.
        """
        member: Membership = get_object_or_404(
            self.get_queryset(),
            id=request.data.get("member", None),
        )
        lower = (
            self.get_queryset()
            .filter(id=request.data.get("lower", None))
            .first()
        )
        # check that memberships are from same group
        if (
            lower
            and lower.group != member.group
            or self.query_params.get("group") != member.group.slug
        ):
            raise exceptions.ValidationError(
                _("All memberships objects must be from the same group."),
            )
        # check user is admin
        if not member.group.is_admin(request.user):
            raise exceptions.PermissionDenied()
        # move the member
        member.priority = lower.priority + 1 if lower else 0
        member.save()
        # move every other members that are higher
        members = self.get_queryset().exclude(id=member.id).all()
        prev_priority = member.priority
        curr_index = len(members) - 1
        if lower is not None:
            while members[curr_index] != lower:
                curr_index -= 1
            curr_index -= 1
        if curr_index >= 0:
            retenue = prev_priority + 1 - members[curr_index].priority
            while curr_index >= 0 and retenue > 0:
                retenue -= max(
                    members[curr_index].priority - prev_priority - 1,
                    0,
                )
                members[curr_index].priority += retenue
                prev_priority = members[curr_index].priority
                curr_index -= 1
            Membership.objects.bulk_update(members, ["priority"])
        return response.Response(status=status.HTTP_200_OK)

    @decorators.action(
        detail=False,
        serializer_class=AdminRequestSerializer,
        permission_classes=[
            permissions.IsAuthenticated,
            AdminRequestListPermission,
        ],
    )
    def admin_requests(self, *args, **kwargs):
        return self.list(*args, **kwargs)

    @decorators.action(
        detail=True,
        methods=["POST"],
        serializer_class=AdminRequestFormSerializer,
    )
    def admin_request(self, request: Request, *args, **kwargs):
        membership: Membership = self.get_object()

        serializer: AdminRequestFormSerializer = self.get_serializer(
            data=request.data
        )
        if membership.admin:
            raise exceptions.MethodNotAllowed(
                "POST", detail="You are already admin of that group"
            )
        if membership.admin_request is True:
            raise exceptions.MethodNotAllowed(
                "POST", "Admin request already sent"
            )

        serializer.is_valid(raise_exception=True)

        message = serializer.validated_data.get("admin_request_message")
        membership.admin_request_message = message
        membership.admin_request = True
        membership.save()

        try:
            # send a message to the discord channel for administrators
            relative_url = (
                f"{membership.group.get_absolute_url()}?tab=adminRequests"
            )
            url = self.request.build_absolute_uri(relative_url)
            send_admin_request(
                f"{membership.student} demande à "
                f"devenir admin de {membership.group.short_name}",
                membership.admin_request_message,
                url,
            )
        except Exception:
            ...

        return response.Response(
            status=status.HTTP_200_OK,
            data={
                "detail": _(
                    "Your admin request has been sent! You will receive the "
                    "answer soon by email."
                ),
            },
        )

    @decorators.action(
        detail=True,
        methods=["POST"],
        serializer_class=serializers.Serializer,
        permission_classes=[
            permissions.IsAuthenticated,
            AdminRequestPermission,
        ],
    )
    def accept_request(self, request, *args, **kwargs):
        membership: Membership = self.get_object()
        if not membership.admin_request:
            raise exceptions.MethodNotAllowed(
                "POST", _("Request already answered!")
            )

        membership.admin_request = False
        membership.admin = True
        membership.admin_request_message = ""
        membership.save()

        try:
            # send response by email
            mail = render_to_string(
                "group/mail/accept_admin_request.html",
                {"group": self.group, "user": self.student.user},
            )
            membership.student.user.email_user(
                subject=(
                    _("Your admin request for %(group)s has been accepted.")
                    % {"group": self.group.name}
                ),
                message=mail,
                html_message=mail,
            )
            # send response on discord
            respond_admin_request(
                f"La demande de {self.student} pour rejoindre {self.group} "
                "a été acceptée."
            )
        except Exception:
            ...

        return response.Response(
            {
                "message": _("The user %(user)s is now admin!")
                % {"user": membership.student}
            },
            status=status.HTTP_202_ACCEPTED,
        )

    @decorators.action(
        detail=True,
        methods=["POST"],
        serializer_class=serializers.Serializer,
    )
    def deny_request(self, request, *args, **kwargs):
        membership: Membership = self.get_object()
        if not membership.admin_request:
            raise exceptions.MethodNotAllowed(
                "POST", _("Request already answered!")
            )

        membership.admin_request = False
        membership.admin_request_message = ""
        membership.save()

        try:
            # send response by email
            mail = render_to_string(
                "group/mail/deny_admin_request.html",
                {"group": self.group, "user": self.student.user},
            )
            membership.student.user.email_user(
                subject=(
                    _("Your admin request for %(group)s has been denied.")
                    % {"group": self.group.name}
                ),
                message=mail,
                html_message=mail,
            )
            # send response on discord
            respond_admin_request(
                f"La demande de {self.student} pour rejoindre {self.group} "
                "a été refusée."
            )
        except Exception:
            ...

        return response.Response(
            {
                "message": _("The admin request from %(user)s has been denied.")
                % {"user": membership.student}
            },
            status=status.HTTP_202_ACCEPTED,
        )


class LabelViewSet(viewsets.ModelViewSet):
    http_method_names = ["get"]
    serializer_class = LabelSerializer
    filter_backends = [filters.OrderingFilter]
    permission_classes = [permissions.IsAuthenticated]
    ordering_fields = ["priority", "name"]
    ordering = ["-priority"]

    @property
    def query_params(self) -> QueryDict:
        return self.request.query_params

    def get_queryset(self):
        qs = Label.objects.all()
        group_type = self.query_params.get("group_type")
        if group_type:
            qs = qs.filter(group_type=group_type)

        return qs
