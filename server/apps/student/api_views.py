from rest_framework import generics, status
from rest_framework.response import Response

from apps.academic.serializers import FollowCourseSerializer
from apps.academic.models import FollowCourse, Course
from apps.student.models import Student

class StudentCoursesView(generics.ListCreateAPIView):
    serializer_class = FollowCourseSerializer
    def get_queryset(self):
        return FollowCourse.objects.filter(student=self.kwargs['student_id'])
    def create(self, request, *args, **kwargs):
        FollowCourse.objects.create(
            student=Student.objects.get(pk=kwargs['student_id']),
            course=Course.objects.get(pk=request.data['course']),
            when=request.data['when']
            )
        return Response({'Success': 'Student will folow this course (maybe)'}, status=status.HTTP_201_CREATED)


class StudentEditFollowCourse(generics.DestroyAPIView):
    serializer_class = FollowCourseSerializer
    def get_queryset(self):
        return FollowCourse.objects.filter(id=self.kwargs['pk'])
