from django.conf.urls import url
from django.urls import path

from .views import *

app_name = 'academic'

urlpatterns = [
    path('<slug:student_id>/courses', follow_courses, name='student_courses'),
    path('course/<slug:pk>', CourseView.as_view(), name='course')
]