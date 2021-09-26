from django.conf.urls import url
from django.urls import path

from .views import *
from apps.group.urls import makeGroupUrlpatterns

app_name = 'academic'

urlpatterns = [
    path('liste/', CoursesList.as_view(), name='index')
] + makeGroupUrlpatterns(
    detail_view=DetailCourseView.as_view()
)