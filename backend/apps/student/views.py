from django.shortcuts import redirect
from django.contrib.auth import login
from django.urls.base import reverse
from django.views.decorators.http import require_http_methods
from django.views.generic import DetailView, ListView, UpdateView
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib import messages
from django.contrib.auth.decorators import login_required

from apps.club.models import NamedMembershipClub
from apps.roommates.models import NamedMembershipRoommates
from apps.academic.models import NamedMembershipCourse

from .models import Student
from .forms import ChangePassForm


class StudentList(LoginRequiredMixin, ListView):
    model = Student
    template_name = 'student/list.html'
    ordering = ['user__last_name', 'user__first_name']
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['ariane'] = [
            {
                'target': '#',
                'label': "Annuaire Étudiant"
            }
        ]
        return context


class StudentProfile(LoginRequiredMixin, DetailView):
    model = Student
    template_name = 'student/profile.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['clubs'] = NamedMembershipClub.objects.filter(
            student=self.object)
        context['courses'] = NamedMembershipCourse.objects.filter(student=self.object).order_by('year')
        context['colocs'] = NamedMembershipRoommates.objects.filter(student=self.object)
        context['ariane'] = [
            {
                'target': reverse('student:list'), 
                'label': 'Annuaire'
            },
            {
                'target': '#',
                'label': self.get_object().name
            }
        ]
        return context


class StudentProfileEdit(UserPassesTestMixin, UpdateView):
    model = Student
    fields = ['promo', 'picture', 'faculty', 'path']
    template_name = 'student/update_profile.html'

    def test_func(self):
        self.object = self.get_object()
        return self.object.user == self.request.user or self.request.user.is_superuser

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['password_form'] = ChangePassForm(self.object.user)
        context['ariane'] = [
            {
                'target': reverse('home:me'), 
                'label': 'Profil'
            },
            {
                'target': '#',
                'label': 'Modifier'
            }
        ]
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
        messages.error(request, form.errors)
        return redirect('student:update', pk)