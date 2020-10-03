from rest_framework import generics, views
from rest_framework.response import Response

from .serializers import CourseSerializer
from .models import Course, FollowCourse, TYPE

class CourseODList(generics.ListAPIView):
    queryset = Course.objects.filter(course_type='OD')
    serializer_class = CourseSerializer


class CourseOPList(generics.ListAPIView):
    queryset = Course.objects.filter(course_type='OD')
    serializer_class = CourseSerializer


class CourseITIIList(generics.ListAPIView):
    queryset = Course.objects.filter(course_type='ITII')
    serializer_class = CourseSerializer


class CourseMasterList(generics.ListAPIView):
    queryset = Course.objects.filter(course_type='Master')
    serializer_class = CourseSerializer


class CourseTypeList(views.APIView):
    def get(self, request):
        return Response(TYPE)