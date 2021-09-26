from rest_framework import generics, views, permissions
from rest_framework.response import Response

from .serializers import CourseSerializer
from .models import Course, TYPE


class CourseODList(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Course.objects.filter(type='OD')
    serializer_class = CourseSerializer


class CourseOPList(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Course.objects.filter(type='OP')
    serializer_class = CourseSerializer


class CourseITIIList(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Course.objects.filter(type='ITII')
    serializer_class = CourseSerializer


class CourseMasterList(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Course.objects.filter(type='Master')
    serializer_class = CourseSerializer


class CourseTypeList(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(TYPE)
