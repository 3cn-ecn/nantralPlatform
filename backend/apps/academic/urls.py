from django.urls import path

from .views import CoursesList, DetailCourseView
from apps.group.urls import makeGroupUrlpatterns

app_name = 'academic'

urlpatterns = [
    path('', CoursesList.as_view(), name='index')
] + makeGroupUrlpatterns(
    detail_view=DetailCourseView.as_view()
)
