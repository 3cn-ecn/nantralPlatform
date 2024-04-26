from apps.utils.parse_bool import parse_bool
from discord_webhook import DiscordEmbed, DiscordWebhook
from django.conf import settings
from django.db.models import Count, F, Q, QuerySet
from django.http.request import QueryDict
from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.utils.translation import gettext as _
from rest_framework import (decorators, exceptions, filters, permissions,
                            response, serializers, status, viewsets)

from .models import Group, GroupType, Label, Membership
from .permissions import GroupPermission, MembershipPermission
from .serializers import (AdminRequestSerializer, GroupPreviewSerializer,
                          GroupSerializer, GroupTypeSerializer,
                          GroupWriteSerializer, LabelSerializer,
                          MembershipSerializer, NewMembershipSerializer)


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
        if self.action == "admin_request":
            return AdminRequestSerializer
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
            ).distinct()
        )

    def get_object(self):
        obj = get_object_or_404(Group, slug=self.kwargs["slug"])
        self.check_object_permissions(self.request, obj)
        return obj

    @decorators.action(detail=True, methods=["POST"])
    def admin_request(self, request, *args, **kwargs):
        obj: Group = self.get_object()
        user = request.user
        serializer = self.get_serializer(data=request.data)

        if obj.is_admin(user):
            return response.Response(
                status=400,
                data={"detail": "You are already admin of that group"},
            )
        membership: Membership = obj.membership_set.get(student__user=user)
        if membership.admin_request is True:
            return response.Response(
                status=400,
                data={"detail": "Admin request already sent"},
            )
        if not serializer.is_valid():
            return response.Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
        message = serializer.validated_data.get("message")
        membership.admin_request = True
        membership.admin_request_messsage = message
        membership.save()
        res = response.Response(
            status=200,
            data={
                "detail": _(
                    "Your admin request has been sent! You will receive the "
                    "answer soon by email."
                ),
            },
        )
        if settings.DEBUG:
            return res
        # send a message to the discord channel for administrators
        accept_url = self.request.build_absolute_uri(
            reverse("group:accept-admin-req", kwargs={"id": membership.id})
        )
        deny_url = self.request.build_absolute_uri(
            reverse("group:deny-admin-req", kwargs={"id": membership.id})
        )
        webhook = DiscordWebhook(url=settings.DISCORD_ADMIN_MODERATION_WEBHOOK)
        embed = DiscordEmbed(
            title=(
                f"{membership.student} demande à "
                f"devenir admin de {membership.group.short_name}"
            ),
            description=membership.admin_request_messsage,
            color=242424,
        )
        embed.add_embed_field(
            name="Accepter", value=f"[Accepter]({accept_url})", inline=True
        )
        embed.add_embed_field(
            name="Refuser", value=f"[Refuser]({deny_url})", inline=True
        )
        webhook.add_embed(embed)
        webhook.execute()

        return res


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
    ordering_fields = []
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
        else:
            return MembershipSerializer

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


class LabelViewSet(viewsets.ModelViewSet):
    http_method_names = ["get"]
    serializer_class = LabelSerializer
    permission_classes = [permissions.IsAuthenticated]

    @property
    def query_params(self) -> QueryDict:
        return self.request.query_params

    def get_queryset(self):
        qs = Label.objects.all()
        group_type = self.query_params.get("group_type")
        if group_type:
            qs = qs.filter(group_type=group_type)

        qs = qs.order_by("-priority")

        return qs
