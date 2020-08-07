from rest_framework import generics

from .serializers import CourseSerializer
from .models import Course, FollowCourse

class CourseODList(generics.ListAPIView):
    queryset = Course.objects.filter(course_type='OD')
    serializer_class = CourseSerializer

class CourseRegistration(generics.CreateAPIView):