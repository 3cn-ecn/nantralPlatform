from django.urls import path

from rest_framework.routers import DefaultRouter

from .api_views import (
    StudentCoursesView,
    StudentEditNamedMembershipCourse,
    StudentListView,
    StudentViewSet)

app_name = 'student'

# router for the API
router = DefaultRouter()
router.register('student', StudentViewSet, basename='student')

# urls
urlpatterns = [
    path('<slug:student_id>/courses',
         StudentCoursesView.as_view(), name='courses'),
    path('<slug:student_id>/courses/<slug:pk>',
         StudentEditNamedMembershipCourse.as_view(), name='unfollow-course'),
    path('', StudentListView.as_view(), name='list')
] + router.urls
