from rest_framework import filters, mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.utils.parse import parse_int

from ..account.models import User
from .serializers import StudentSerializer


class StudentPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj: User) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user == obj


class StudentViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    """An API endpoint for users."""

    permission_classes = [permissions.IsAuthenticated, StudentPermission]
    serializer_class = StudentSerializer
    search_fields = ["first_name", "last_name"]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    ordering_fields = ["promo", "first__name", "last_name", "path"]
    ordering = ["first_name", "last_name"]

    def get_queryset(self):
        queryset = User.objects.all()

        promo = parse_int(self.request.GET.get("promo"))
        path = self.request.GET.get("path")
        faculty = self.request.GET.get("faculty")

        if promo:
            queryset = queryset.filter(promo=promo)
        if faculty:
            queryset = queryset.filter(faculty=faculty)
        if path:
            queryset = queryset.filter(path=path)

        return queryset

    @action(detail=False, methods=["GET"])
    def me(self, request, *args, **kwargs):
        """A view to get the current user."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
