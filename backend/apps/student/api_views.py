from rest_framework import filters, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.utils.parse import parse_int

from .models import Student
from .serializers import StudentSerializer


class StudentPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj: Student) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user == obj.user


class StudentViewSet(viewsets.ModelViewSet):
    """An API endpoint for students."""

    http_method_names = ["get", "options"]
    permission_classes = [permissions.IsAuthenticated, StudentPermission]
    serializer_class = StudentSerializer
    search_fields = ["user__first_name", "user__last_name"]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    ordering_fields = ["promo", "user__first__name", "user___last_name", "path"]
    ordering = ["user__first_name", "user__last_name"]

    def get_queryset(self):
        queryset = Student.objects.all()

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
        serializer = self.get_serializer(request.user.student)
        return Response(serializer.data)
