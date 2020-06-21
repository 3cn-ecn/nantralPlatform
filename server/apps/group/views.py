from django.shortcuts import redirect, render
from django.views.generic import ListView, View, FormView, TemplateView
from .models import Club, Group, NamedMembershipClub, Liste, NamedMembershipList
from .forms import NamedMembershipClubFormset, NamedMembershipAdd, UpdateClubForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods

from apps.student.models import Student
from apps.event.models import Event

from apps.event.forms import EventFormSet

from apps.utils.accessMixins import UserIsAdmin

class ListClubView(ListView):
    model = Club
    template_name = 'group/club_list.html'


class ListeListView(ListView):
    model = Liste
    template_name = 'liste/list.html'


class UpdateGroupView(UserIsAdmin, TemplateView):
    template_name = 'group/club_update.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        self.object = Group.get_group_by_slug(self.kwargs['group_slug'])
        context['object'] = self.object
        if  isinstance(context['object'], Club):
            context['club'] = True
            context['form'] = UpdateClubForm(instance=self.object)
        else:
            context['club'] = False
        return context

    def post(self, request, group_slug):
        group = Group.get_group_by_slug(self.kwargs['group_slug'])
        if  isinstance(group, Club):
            form = UpdateClubForm(request.POST, instance=group)
            form.save()
        else:
            pass
        return redirect('group:update', group_slug)


class UpdateGroupEventsView(UserIsAdmin, View):
    template_name = 'group/club_events_update.html'

    def get_context_data(self, **kwargs):
        context = {}
        context['object'] = Group.get_group_by_slug(kwargs['group_slug'])
        context['events'] = Event.objects.filter(group=kwargs['group_slug'])
        context['form'] = EventFormSet(queryset=context['events'])
        return context

    def get(self, request, group_slug):
        return render(request, self.template_name, context=self.get_context_data(group_slug=group_slug))

    def post(self, request,  group_slug):
        return edit_events(request, group_slug)


class UpdateGroupMembersView(UserIsAdmin, View):
    template_name = 'group/club_members_update.html'

    def get_context_data(self, **kwargs):
        context = {}
        context['object'] = Group.get_group_by_slug(kwargs['group_slug'])
        if isinstance(context['object'], Club):
            memberships = NamedMembershipClub.objects.filter(club=context['object'])
            membersForm = NamedMembershipClubFormset(queryset=memberships)
            context['members'] = membersForm
        return context

    def get(self, request, group_slug):
        return render(request, self.template_name, context=self.get_context_data(group_slug=group_slug))
    
    def post(self, request,  group_slug):
        return edit_named_memberships(request, group_slug)

class DetailGroupView(TemplateView):
    template_name = 'group/club_detail.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        self.object = Group.get_group_by_slug(self.kwargs['group_slug'])
        context['object'] = self.object
        if  isinstance(context['object'], Club):
            members = NamedMembershipClub.objects.filter(club=self.object)
            context['form'] = NamedMembershipAdd()
        elif isinstance(context['object'], Liste):
            members = NamedMembershipList.objects.filter(liste=self.object)
        else:
            members = self.object.members
        context['members'] = members
        context['is_member'] = self.object.is_member(self.request.user)
        context['is_admin'] = self.object.is_admin(self.request.user) if self.request.user.is_authenticated else False
        context['events'] = Event.objects.filter(group=self.object.slug)
        return context


class AddToClubView(FormView):
    form_class = NamedMembershipAdd
    def form_valid(self, form):
        self.object = form.save(commit=False)
        self.object.student = self.request.user.student
        self.object.group = Club.objects.get(id=self.kwargs['club_id'])
        self.object.save()
        return redirect('group:detail', self.kwargs['club_id'])


@login_required
def add_member(request, group_slug, student_id):
    """Add a user to a club"""
    club = Group.get_group_by_slug(group_slug)
    student = Student.objects.get(id=student_id)
    if isinstance(Club, group):
        NamedMembershipClub.objects.create(student=student, club=group)


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
    form = EventFormSet(request.POST)
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
