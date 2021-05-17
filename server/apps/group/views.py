from datetime import date, timedelta
from django.http.request import HttpRequest

from django.shortcuts import redirect, render
from django.views.generic import ListView, View, FormView, TemplateView
from .models import Club, Group, NamedMembershipClub, Liste, NamedMembershipList
from .forms import NamedMembershipClubFormset, NamedMembershipAddClub, NamedMembershipAddListe, UpdateClubForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.decorators.http import require_http_methods

from apps.student.models import Student
from apps.event.models import BaseEvent
from apps.post.models import Post


from apps.utils.accessMixins import UserIsAdmin


class ListClubView(ListView):
    model = Club
    template_name = 'club/list.html'
    ordering = ['bdx_type', 'name']


class ListeListView(ListView):
    model = Liste
    template_name = 'liste/list.html'
    ordering = ['year', 'liste_type', 'name']


class UpdateGroupView(UserIsAdmin, TemplateView):
    template_name = 'group/update.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        self.object = Group.get_group_by_slug(self.kwargs['group_slug'])
        context['object'] = self.object
        if isinstance(context['object'], Club):
            context['club'] = True
            context['form'] = UpdateClubForm(instance=self.object)
        else:
            context['club'] = False
        return context

    def post(self, request, group_slug):
        group = Group.get_group_by_slug(self.kwargs['group_slug'])
        if isinstance(group, Club):
            form = UpdateClubForm(request.POST, instance=group)
            form.save()
        else:
            pass
        return redirect('group:update', group_slug)


class UpdateGroupMembersView(UserIsAdmin, View):
    template_name = 'group/members_edit.html'

    def get_context_data(self, **kwargs):
        context = {}
        context['object'] = Group.get_group_by_slug(kwargs['group_slug'])
        if isinstance(context['object'], Club):
            memberships = NamedMembershipClub.objects.filter(
                club=context['object'])
            membersForm = NamedMembershipClubFormset(queryset=memberships)
            context['members'] = membersForm
        return context

    def get(self, request, group_slug):
        return render(request, self.template_name, context=self.get_context_data(group_slug=group_slug))

    def post(self, request,  group_slug):
        return edit_named_memberships(request, group_slug)


class DetailGroupView(TemplateView):
    template_name = 'group/detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        self.object = Group.get_group_by_slug(self.kwargs['group_slug'])
        context['object'] = self.object
        if isinstance(context['object'], Club):
            members = NamedMembershipClub.objects.filter(club=self.object)
            context['form'] = NamedMembershipAddClub()
        elif isinstance(context['object'], Liste):
            members = NamedMembershipList.objects.filter(liste=self.object)
            context['form'] = NamedMembershipAddListe()
        else:
            members = self.object.members
        context['members'] = members
        context['is_member'] = self.object.is_member(self.request.user)
        context['is_admin'] = self.object.is_admin(
            self.request.user) if self.request.user.is_authenticated else False
        context['events'] = BaseEvent.objects.filter(
            group=self.object.slug, date__gte=date.today()).order_by('date')
        context['posts'] = Post.objects.filter(
            group=self.object.slug, publication_date__gte=date.today()-timedelta(days=10)
        ).order_by('publication_date')
        return context


class AddToGroupView(LoginRequiredMixin, FormView):
    raise_exception = True

    def form_valid(self, form):
        self.object = form.save(commit=False)
        self.object.student = self.request.user.student
        if self.form_class == NamedMembershipAddClub:
            self.object.club = Club.objects.get(slug=self.kwargs['slug'])
        elif self.form_class == NamedMembershipAddListe:
            self.object.liste = Liste.objects.get(slug=self.kwargs['slug'])
        self.object.save()
        return redirect('group:detail', self.kwargs['slug'])

    def get_form_class(self):
        group = Group.get_group_by_slug(self.kwargs['slug'])
        if isinstance(group, Club):
            self.form_class = NamedMembershipAddClub
            return NamedMembershipAddClub
        if isinstance(group, Liste):
            self.form_class = NamedMembershipAddListe
            return NamedMembershipAddListe


@ require_http_methods(['POST'])
@ login_required
def edit_named_memberships(request, group_slug):
    club = Club.objects.filter(slug=group_slug).first()
    form = NamedMembershipClubFormset(request.POST)
    if form.is_valid():
        members = form.save(commit=False)
        for member in members:
            member.group = club
            member.save()
        for member in form.deleted_objects:
            member.delete()
        messages.success(request, 'Membres modifies')
        return redirect('group:update', club.id)
    else:
        messages.warning(request, form.errors)
        return redirect('group:update', club.id)
