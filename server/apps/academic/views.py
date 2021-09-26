from django.views.generic import ListView
from django.contrib.auth.mixins import LoginRequiredMixin

from .models import Course
from apps.group.views import DetailGroupView


class CoursesList(LoginRequiredMixin, ListView):
    model = Course
    template_name = 'academic/list.html'
    ordering = ['type', 'name']


class DetailCourseView(DetailGroupView):
    template_name = 'academic/detail.html'