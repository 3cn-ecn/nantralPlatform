from django.shortcuts import redirect, render
from django.views.generic import DetailView, UpdateView, ListView, View
from .models import Club, Group, NamedMembership
from .forms import NamedMembershipClubFormset
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.contrib.auth.mixins import UserPassesTestMixin

from apps.student.models import Student
from apps.event.models import Event

from apps.event.forms import EventGroupFormSet

class ListClubView(ListView):
    model = Club
    template_name = 'group/club_list.html'


class UpdateClubView(UpdateView):
    model = Club
    template_name = 'group/club_update.html'
    fields = ['description', 'admins', 'logo']

class UpdateGroupEventsView(UserPassesTestMixin, View):
    template_name = 'group/club_events_update.html'
    def test_func(self):
        group = Group.get_group_by_slug(self.kwargs['group_slug'])
        return group.is_admin(self.request.user)
    def get_context_data(self, **kwargs):
        context = {}
        context['object'] = Group.get_group_by_slug(kwargs['group_slug'])
        context['events'] = Event.objects.filter(group=kwargs['group_slug'])
        context['form'] = EventGroupFormSet(queryset=context['events'])
        return context

    def get(self, request, group_slug):
        return render(request, self.template_name, context=self.get_context_data(group_slug=group_slug))

    def post(self, request,  group_slug):
        return edit_events(request, group_slug)

    def delete(self, request, group_slug, event_id):

class UpdateGroupMembersView(UserPassesTestMixin, View):
    template_name = 'group/club_members_update.html'
    def test_func(self):
        group = Group.get_group_by_slug(self.kwargs['group_slug'])
        return group.is_admin(self.request.user)

    def get_context_data(self, **kwargs):
        context = {}
        context['object'] = Group.get_group_by_slug(kwargs['group_slug'])
        if isinstance(context['object'], Club):
            memberships = NamedMembership.objects.filter(group=context['object'])
            membersForm = NamedMembershipClubFormset(queryset=memberships)
            context['members'] = membersForm
        return context

    def get(self, request, group_slug):
        return render(request, self.template_name, context=self.get_context_data(group_slug=group_slug))
    
    def post(self, request,  group_slug):
        return edit_named_memberships(request, group_slug)



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
    group = Group.get_group_by_slug(group_slug)
    student = Student.objects.get(id=student_id)
    if isinstance(Club, group):
        NamedMembership.objects.create(student=student, group=group)


@require_http_methods(['POST'])
@login_required
def edit_named_memberships(request, group_slug):
    club = Club.objects.filter(slug=group_slug).first()
    form = NamedMembershipClubFormset(request.POST)
    if form.is_valid():
        members = form.save(commit=False)
        for member in members:
            member.group = club
            member.save()
        for  member in form.deleted_objects:
            member.delete()
        messages.success(request, 'Membres modifies')
        return redirect('group:update', club.id)
    else:
        messages.warning(request, form.errors)
        return redirect('group:update', club.id)


@login_required
def edit_events(request, group_slug):
    group = Group.get_group_by_slug(group_slug)
    form = EventGroupFormSet(request.POST)
    if form.is_valid():
        events = form.save(commit=False)
        # Link each event to the group
        for event in events:
            event.group = group.slug
            event.save()
        # Delete  missing events
        for  event in form.deleted_objects:
            event.delete()
        messages.success(request, 'Events  modifies')
        return redirect('group:update-events', group_slug)
    else:
        messages.warning(request, form.errors)
        return redirect('group:update-events', group_slug)
