from django.views.generic import ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils import timezone

from .models import Course
from apps.group.views import DetailGroupView


class CoursesList(LoginRequiredMixin, ListView):
    model = Course
    template_name = 'academic/list.html'
    ordering = ['type', 'name']


class DetailCourseView(DetailGroupView):
    template_name = 'academic/detail.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        group = context['object']
        this_year = timezone.now().year
        if timezone.now().month < 8:
            this_year -= 1
        context['members'] = group.members.through.objects.filter(
            group=group, year=this_year).order_by('student__user__first_name')
        return context
    