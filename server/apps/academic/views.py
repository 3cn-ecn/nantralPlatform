from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.views.generic import DetailView

from .models import Course, FollowCourse
from .forms import TakeCourseFormSet

from apps.student.models import Student

class CourseView(DetailView):
    model = Course
    template_name = 'courses/course_detail.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        students_following = FollowCourse.objects.filter(course=self.object)
        groupped = {}
        for student in students_following:
            print(student.student)
            if student.student.promo in groupped:
                groupped[student.student.promo].append(student.student)
            else:
                groupped[student.student.promo] = [student.student]
        print(groupped)
        context['students'] = groupped
        return context

@login_required
@require_http_methods(['POST'])
def follow_courses(request, student_id):
    student = Student.objects.get(pk=student_id)
    form = TakeCourseFormSet(request.POST)
    if form.is_valid():
        take_courses = form.save(commit=False)
        for course in take_courses:
            course.student = student
            course.save()
        messages.success(request, 'Cours modifiés!')
        return redirect('student:update', student_id)
    else:
        messages.warning(request, forms.errors)
        return redirect('student:update', student_id)
