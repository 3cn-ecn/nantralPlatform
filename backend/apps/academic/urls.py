from django.urls import path

from .views import CoursesList, DetailCourseView
from apps.group.abstract.urls import make_group_url_patterns

app_name = 'academic'

urlpatterns = [
    path('', CoursesList.as_view(), name='index')
] + make_group_url_patterns(
    detail_view=DetailCourseView.as_view()
)
