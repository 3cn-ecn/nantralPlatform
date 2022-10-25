from rest_framework import generics, views, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .serializers import CourseMemberSerializer, CourseSerializer
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


class ListCourseMembersAPIView(generics.ListAPIView):
    """List all the members of a course."""
    serializer_class = CourseMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        course_id = self.request.query_params.get('id')
        course = get_object_or_404(Course, id=course_id)
        this_year = timezone.now().year
        if timezone.now().month < 8:
            this_year -= 1
        named_memberships = course.members.through.objects.filter(
            group=course, year=this_year
        ).order_by('student__user__first_name')
        return named_memberships
