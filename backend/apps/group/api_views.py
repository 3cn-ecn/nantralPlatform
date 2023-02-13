from django.db.models import Q, QuerySet, Count
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.utils.translation import gettext as _

from rest_framework import (
    decorators,
    exceptions,
    permissions,
    response,
    serializers,
    status,
    viewsets)

from apps.utils.searchAPIMixin import SearchAPIMixin
from .models import Group, Membership, GroupType
from .serializers import (
    MembershipSerializer,
    NewMembershipSerializer,
    GroupSerializer)


class GroupPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj: Group):
        if request.method in permissions.SAFE_METHODS:
            return (obj.public or (
                    request.user.is_authenticated and (
                        not obj.private or obj.is_member(request.user))))
        return obj.is_admin(request.user)


class GroupViewSet(SearchAPIMixin, viewsets.ModelViewSet):
    """An API endpoint for groups."""

    permission_classes = [GroupPermission]
    serializer_class = GroupSerializer
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'
    search_fields = ['name', 'short_name']

    def get_queryset(self) -> QuerySet[Group]:
        user = self.request.user
        group_type = get_object_or_404(
            GroupType, slug=self.request.query_params.get('type', None))
        return (Group.objects
                # filter by group_type
                .filter(group_type=group_type)
                # remove the sub-groups to keep only parent groups
                .filter(Q(parent=None)
                        | Q(parent__in=group_type.extra_parents.all()))
                # hide archived groups
                .filter(archived=False)
                # hide private groups unless user is member
                # and hide non-public group if user is not authenticated
                .filter(Q(private=False) | Q(members=user.student)
                        if user.is_authenticated
                        else Q(public=True))
                # hide groups without active members (ie end_date > today)
                .annotate(num_active_members=Count(
                    'membership_set',
                    filter=Q(membership_set__end_date__gte=timezone.now())))
                .filter(Q(num_active_members__gt=0)
                        if group_type.hide_no_active_members
                        else Q())
                # prefetch type and parent group for better performances
                .prefetch_related('group_type', 'parent')
                # order by category, order and then name
                .order_by(*group_type.sort_fields.split(',')))

    def get_object(self):
        obj = get_object_or_404(Group, slug=self.kwargs['slug'])
        self.check_object_permissions(self.request, obj)
        return obj


class MembershipPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj: Membership):
        if request.method in permissions.SAFE_METHODS:
            return True
        return (obj.student.user == request.user
                or obj.group.is_admin(request.user))


class MembershipViewSet(SearchAPIMixin, viewsets.ModelViewSet):
    """An API viewset to get memberships of a group. This viewset ignore all
    logic related with admin requests.

    Query Params
    ------------
    student: id
        The student id
    group: str (required)
        The group slug
    from: Date
        The date from which we want to filter the member list
    to: Date
        The date to which we want to filter the member list

    List Actions (/api/group/membership)
    ------------
    list (GET): list all memberships objects, filtered by query params
    create (POST): create a new membership object

    Detail Actions (/api/group/membership/<id>)
    --------------
    retrieve (GET): get the membership object by id
    update (PUT) : replace the membership object by a new membership object
    partial_update (PATCH): update some fields of the membership object
    destroy (DELETE): delete the membership object
    """

    permission_classes = [permissions.IsAuthenticated, MembershipPermission]
    search_fields = ['student__user__first_name', 'student__user__last_name',
                     'group__name', 'group__short_name', 'summary']

    def get_serializer_class(self) -> serializers.ModelSerializer:
        if self.action == 'create':
            return NewMembershipSerializer
        else:
            return MembershipSerializer

    def get_query_param(self, param: str, default=None) -> any:
        return self.request.query_params.get(param, default)

    def get_queryset(self) -> QuerySet[Membership]:
        """
        Get list of memberships filtered by query params.
        Used by list, retrieve, update, partial_update and destroy actions.
        """
        if self.queryset:
            return self.queryset
        user = self.request.user
        # parse params
        from_date = parse_datetime(self.get_query_param('from', ''))
        to_date = parse_datetime(self.get_query_param('to', ''))
        group_slug = self.get_query_param('group')
        student_id = self.get_query_param('student')
        # make queryset
        self.queryset = (
            Membership.objects
            # filter by memberships you are allowed to see
            .filter(
                Q(group__private=False)
                | Q(group__members=user.student)
                if not user.is_superuser else Q())
            # filter by params
            .filter(
                Q(group__slug=group_slug) if group_slug else Q(),
                Q(student__id=student_id) if student_id else Q(),
                Q(end_date__gte=from_date) if from_date else Q(),
                Q(begin_date__lt=to_date) if to_date else Q())
            # order fields
            .order_by('-order',
                      'student__user__first_name',
                      'student__user__last_name')
            .prefetch_related('student__user'))
        return self.queryset

    def list(self, request, *args, **kwargs):
        """
        LIST view to list memberships. Overridden to avoid getting all
        memberships (request must provide a group or a student)
        """
        group = self.get_query_param('group')
        student = self.get_query_param('student')
        if group is None and student is None:
            raise exceptions.ParseError(
                detail=_("Provides either 'group' or 'student' as params."))
        return super().list(request, *args, **kwargs)

    @decorators.action(detail=False, methods=['post'])
    def reorder(self, request, *args, **kwargs):
        """
        Action to reorder a membership. It changes the 'order' fields for all
        members of a group to place the member between two other members, in the
        list of memberships defined by the query parameters.

        Body Parameters
        ---------------
        member: id of the membership we want to move elsewhere
        lower: id of the membership that should be just before the member,
               for the given query parameters, or None if member should be the
               last.
        """
        member: Membership = get_object_or_404(
            self.get_queryset(),
            id=request.data.get('member', None))
        lower = self.get_queryset().filter(
            id=request.data.get('lower', None)).first()
        # check that memberships are from same group
        if (lower and lower.group != member.group
                or self.get_query_param('group') != member.group.slug):
            raise exceptions.ValidationError(_(
                "All memberships objects must be from the same group."))
        # check user is admin
        if not member.group.is_admin(request.user):
            raise exceptions.PermissionDenied()
        # move the member
        member.order = lower.order + 1 if lower else 0
        member.save()
        # move every other members that are higher
        members = self.get_queryset().exclude(id=member.id).all()
        prev_order = member.order
        curr_index = len(members) - 1
        if lower is not None:
            while members[curr_index] != lower:
                curr_index -= 1
            curr_index -= 1
        if curr_index >= 0:
            retenue = prev_order + 1 - members[curr_index].order
            while curr_index >= 0 and retenue > 0:
                retenue -= max(members[curr_index].order - prev_order - 1, 0)
                members[curr_index].order += retenue
                prev_order = members[curr_index].order
                curr_index -= 1
            Membership.objects.bulk_update(members, ['order'])
        return response.Response(status=status.HTTP_200_OK)
