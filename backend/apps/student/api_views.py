from rest_framework import exceptions, generics, permissions, viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Student
from .serializers import StudentSerializer


class StudentListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StudentSerializer

    def get_queryset(self):
        if self.request.GET.get('search') is not None:
            return Student.objects.filter(
                user__username__icontains=self.request.GET.get('search'))[:10]
        return Student.objects.all()


class StudentPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj: Student) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user == obj.user


class StudentViewSet(viewsets.ModelViewSet):
    """An API endpoint for students."""

    permission_classes = [permissions.IsAuthenticated, StudentPermission]
    serializer_class = StudentSerializer
    search_fields = ['user__first_name', 'user__last_name']
    queryset = Student.objects.all()
    filter_backends = [filters.SearchFilter]

    def create(self, request, *args, **kwargs):
        """Remove the 'create' method from default methods."""
        raise exceptions.MethodNotAllowed(method="create")

    @action(detail=False, methods=['GET'])
    def me(self, request, *args, **kwargs):
        """A view to get the current user."""
        serializer = self.get_serializer(request.user.student)
        return Response(serializer.data)
