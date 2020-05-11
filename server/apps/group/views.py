from django.shortcuts import redirect
from django.views.generic import DetailView, UpdateView, ListView
from .models import Club, Group, NamedMembership
from .forms import NamedMembershipClubFormset
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods

from apps.student.models import Student

class ListClubView(ListView):
    model = Club
    template_name = 'group/club_list.html'


class UpdateClubView(UpdateView):
    model = Club
    template_name = 'group/club_update.html'
    fields = ['description', 'admins']
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        memberships = NamedMembership.objects.filter(group=self.object)
        membersForm = NamedMembershipClubFormset(queryset=memberships)
        context['members'] = membersForm
        return context

class DetailClubView(DetailView):
    model = Club
    template_name = 'group/club_detail.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        members = NamedMembership.objects.filter(group=self.object)
        context['members'] = members
        return context

@login_required
def add_member(request, group_slug, student_id):
    """Add a user to a club"""
    type_slug = group_slug.split('--')[0]
    if type_slug == 'club':
        club = Club.objects.get(slug=group_slug)
        student = Student.objects.get(id=student_id)
        NamedMembership.objects.create(student=student, group=club)


@require_http_methods(['POST'])
@login_required
def edit_named_memberships(request, pk):
    club = Club.objects.get(pk=pk)
    form = NamedMembershipClubFormset(request.POST)
    if form.is_valid():
        members = form.save(commit=False)
        for member in members:
            member.group = club
            member.save()
        messages.success(request, 'Membres modifies')
        return redirect('group:update', pk)
    else:
        messages.warning(request, form.errors)
        return redirect('group:update', pk)