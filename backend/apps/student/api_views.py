from rest_framework import generics, status, permissions, viewsets, exceptions
from rest_framework.response import Response

from apps.academic.serializers import NamedMembershipCourseSerializer
from apps.academic.models import NamedMembershipCourse, Course
from apps.utils.searchAPIMixin import SearchAPIMixin

from .models import Student
from .serializers import StudentSerializer


class StudentCoursesView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NamedMembershipCourseSerializer

    def get_queryset(self):
        return NamedMembershipCourse.objects.filter(
            student=self.kwargs['student_id'])

    def create(self, request, *args, **kwargs):
        NamedMembershipCourse.objects.create(
            student=Student.objects.get(pk=kwargs['student_id']),
            course=Course.objects.get(pk=request.data['group']),
            when=request.data['year']
        )
        return Response(
            {'Success': 'Student will folow this course (maybe)'},
            status=status.HTTP_201_CREATED)


class StudentEditNamedMembershipCourse(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NamedMembershipCourseSerializer

    def get_queryset(self):
        return NamedMembershipCourse.objects.filter(id=self.kwargs['pk'])


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


class StudentViewSet(SearchAPIMixin, viewsets.ModelViewSet):
    """An API endpoint for students."""

    permission_classes = [permissions.IsAuthenticated, StudentPermission]
    serializer_class = StudentSerializer
    search_fields = ['user__first_name', 'user__last_name']
    queryset = Student.objects.all()

    def create(self, request, *args, **kwargs):
        raise exceptions.MethodNotAllowed(method="create")
