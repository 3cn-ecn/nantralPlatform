from django.db.models import Q, QuerySet
from django.http.request import QueryDict

from rest_framework import filters, permissions, request, viewsets

from apps.utils.parse_bool import parse_bool

from .models import Post
from .serializers import (PostPreviewSerializer, PostSerializer,
                          PostWriteSerializer)


class PostPermission(permissions.BasePermission):

    def has_object_permission(self, request: request.Request, view, obj: Post):
        if request.method in permissions.SAFE_METHODS:
            return obj.can_view(request.user)
        else:
            return obj.group.is_admin(request.user)


class PostViewSet(viewsets.ModelViewSet):
    """An API endpoint for post

    Query Parameters
    ----------------
    - group: list[str]
        Filter by a list of organizing groups
    - min_date: 'yyyy-MM-dd'
        Filter by a minimal date
    - max_date: 'yyyy-MM-dd'
        Filter by a maximal date
    - pinned: bool
        Filter by pinned posts only
    - is_member: bool
        Filter posts where user is member of the organizing group
    - search: str
        Perform a search query on a list
    - ordering: list[str]
        List of fields to order by

    Actions
    -------
    - GET .../post/ : get the list of post
    - POST .../post/ : create a new post
    - GET .../post/<id>/ : get a post
    - PUT .../post/<id>/ : update a post
    - DELETE .../post/<id>/ : delete a post
    """
    permission_classes = [permissions.IsAuthenticated, PostPermission]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'group__name', 'group__short_name']
    ordering_fields = ['title', 'group__name',
                       'group__short_name', 'created_at', 'updated_at']
    ordering = ["-updated_at"]

    @property
    def query_params(self) -> QueryDict:
        return self.request.query_params

    def get_serializer_class(self):
        preview = parse_bool(self.query_params.get('preview'))
        if self.request.method in ["POST", "PUT", "PATCH"]:
            return PostWriteSerializer
        if preview is True:
            return PostPreviewSerializer
        if preview is False:
            return PostSerializer
        if self.detail:
            return PostSerializer
        return PostPreviewSerializer

    def get_queryset(self) -> QuerySet[Post]:
        group_param = self.query_params.get('group')
        group_filter = group_param.split(',') if group_param else []
        is_member = parse_bool(self.query_params.get('is_member'))
        pinned = parse_bool(self.query_params.get('pinned'))
        min_date = self.query_params.get('min_date')
        max_date = self.query_params.get('max_date')

        user = self.request.user

        query = (
            Post.objects
            .filter(Q(publicity='Pub') | Q(group__members__user=user))
        )
        if is_member is True:
            query = query.filter(group__members__user=user)
        if is_member is False:
            query = query.exclude(group__members__user=user)
        if pinned is not None:
            query = query.filter(pinned=pinned)
        if len(group_filter) > 0:
            query = query.filter(group__slug__in=group_filter)
        if min_date:
            query = query.filter(created_at__gte=min_date)
        if max_date:
            query = query.filter(created_at__lte=max_date)

        return query.select_related('group').distinct()
