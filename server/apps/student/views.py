from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.views.decorators.http import require_http_methods
from django.urls import reverse_lazy
from django.views.generic import DetailView, ListView, UpdateView
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.contrib.auth.decorators import login_required

from .models import Student
from .forms import ChangePassForm

class StudentList(LoginRequiredMixin, ListView):
    model = Student
    template_name = 'student/list.html'

class StudentProfile(LoginRequiredMixin, DetailView):
    model = Student
    template_name = 'student/profile.html'

class StudentProfileEdit(LoginRequiredMixin, UpdateView):
    model = Student
    fields = ['promo']
    template_name = 'student/update_profile.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['password_form'] = ChangePassForm(self.object.user)
        return context

@require_http_methods(['POST'])
@login_required
def change_password(request, pk):
    form = ChangePassForm(request.user, request.POST)
    if form.is_valid():
        user = form.save()
        update_session_auth_hash(request, user)
        login(request, user, backend='apps.account.emailAuthBackend.EmailBackend')
        messages.success(request, 'Mot de passge changé !')
        return redirect('student:update', pk)
    else:
        messages.warning(request, form.errors)
        return redirect('student:update', pk)




