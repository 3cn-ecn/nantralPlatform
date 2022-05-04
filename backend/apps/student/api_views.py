from rest_framework import generics, status, permissions
from rest_framework.response import Response

from apps.academic.serializers import NamedMembershipCourseSerializer
from apps.academic.models import NamedMembershipCourse, Course
from apps.student.models import Student
from apps.student.serializers import StudentSerializer


class StudentCoursesView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NamedMembershipCourseSerializer

    def get_queryset(self):
        return NamedMembershipCourse.objects.filter(student=self.kwargs['student_id'])

    def create(self, request, *args, **kwargs):
        NamedMembershipCourse.objects.create(
            student=Student.objects.get(pk=kwargs['student_id']),
            course=Course.objects.get(pk=request.data['group']),
            when=request.data['year']
        )
        return Response({'Success': 'Student will folow this course (maybe)'}, status=status.HTTP_201_CREATED)


class StudentEditNamedMembershipCourse(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NamedMembershipCourseSerializer

    def get_queryset(self):
        return NamedMembershipCourse.objects.filter(id=self.kwargs['pk'])


class StudentList(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StudentSerializer

    def get_queryset(self):
        if self.request.GET.get('search') is not None:
            return Student.objects.filter(user__username__icontains=self.request.GET.get('search'))[:10]
        return Student.objects.all()
