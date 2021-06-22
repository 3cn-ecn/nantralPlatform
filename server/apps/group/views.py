from datetime import date, timedelta

from django.shortcuts import redirect, render
from django.urls.base import reverse
from django.views.generic import ListView, View, FormView, TemplateView, DetailView

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.sites.shortcuts import get_current_site
from django.views.decorators.http import require_http_methods


from apps.group.models import AdminRightsRequest, Group
from apps.club.models import Club, NamedMembershipClub, BDX
from apps.liste.models import Liste, NamedMembershipList
from apps.sociallink.models import SocialNetwork, SocialLink
from apps.event.models import BaseEvent
from apps.post.models import Post

from apps.group.forms import AdminRightsRequestForm
from apps.club.forms import NamedMembershipClubFormset, NamedMembershipAddClub, UpdateClubForm
from apps.liste.forms import NamedMembershipAddListe, NamedMembershipListeFormset

from apps.utils.accessMixins import UserIsAdmin


class UpdateGroupView(UserIsAdmin, TemplateView):
    template_name = 'group/update.html'

    def get_object(self, **kwargs):
        return Group.get_group_by_slug(self.kwargs['group_slug'])
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        self.object = self.get_object()
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
            form = UpdateClubForm(request.POST, request.FILES, instance=group)
            form.save()
        else:
            pass
        return redirect('group:update', group_slug)


class UpdateGroupMembersView(UserIsAdmin, TemplateView):
    template_name = 'group/members_edit.html'

    def get_object(self, **kwargs):
        return Group.get_group_by_slug(self.kwargs['group_slug'])
    
    def get_context_data(self, **kwargs):
        context = {}
        context['object'] = self.get_object()
        if isinstance(context['object'], Club):
            memberships = NamedMembershipClub.objects.filter(
                group=context['object'])
            membersForm = NamedMembershipClubFormset(queryset=memberships)
            context['members'] = membersForm
        return context

    #def get(self, request, group_slug):
        #return render(request, self.template_name, context=self.get_context_data(group_slug=group_slug))

    def post(self, request,  group_slug):
        print(f'Post {group_slug}')
        return edit_named_memberships(request, group_slug)


class DetailGroupView(DetailView):
    template_name = 'group/detail/detail.html'

    def get_object(self, **kwargs):
        return Group.get_group_by_slug(self.kwargs['group_slug'])

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        self.object = self.get_object()
        context['admin_req_form'] = AdminRightsRequestForm()
        context['members'] = self.object.members.through.objects.filter(group=self.object)
        if isinstance(context['object'], Club):
            context['form'] = NamedMembershipAddClub()
        elif isinstance(context['object'], Liste):
            context['form'] = NamedMembershipAddListe()
        context['social'] = SocialLink.objects.filter(slug=self.object.slug)
        context['is_member'] = self.object.is_member(self.request.user)
        if self.request.user.is_authenticated:
            context['is_admin'] = self.object.is_admin(self.request.user)
        else:
            context['is_admin'] = False
        context['events'] = BaseEvent.objects.filter(
            group=self.object.slug, date__gte=date.today()).order_by('date')
        context['posts'] = Post.objects.filter(
            group=self.object.slug, publication_date__gte=date.today()-timedelta(days=10)
        ).order_by('publication_date')
        return context


class AddToGroupView(LoginRequiredMixin, FormView):
    raise_exception = True

    def get_group(self, **kwargs):
        return Group.get_group_by_slug(self.kwargs['group_slug'])

    def form_valid(self, form):
        self.object = form.save(commit=False)
        self.object.student = self.request.user.student
        self.object.group = self.get_group()
        '''
        if self.form_class == NamedMembershipAddClub:
            self.object.group = Club.objects.get(slug=self.kwargs['group_slug'])
        elif self.form_class == NamedMembershipAddListe:
            self.object.group = Liste.objects.get(slug=self.kwargs['group_slug'])
        '''
        self.object.save()
        return redirect('group:detail', self.kwargs['group_slug'])

    def get_form_class(self):
        group = self.get_group()
        if isinstance(group, Club):
            self.form_class = NamedMembershipAddClub
            return NamedMembershipAddClub
        if isinstance(group, Liste):
            self.form_class = NamedMembershipAddListe
            return NamedMembershipAddListe


@ require_http_methods(['POST'])
@ login_required
def edit_named_memberships(request, group_slug):
    group = Group.get_group_by_slug(group_slug)
    if isinstance(group, Club):
        form = NamedMembershipClubFormset(request.POST)
    elif isinstance(group, Liste):
        form = NamedMembershipListeFormset(request.POST)
    if form.is_valid():
        members = form.save(commit=False)
        for member in members:
            member.group = group
            member.save()
        for member in form.deleted_objects:
            member.delete()
        messages.success(request, 'Membres modifies')
        return redirect('group:update', group.slug)
    else:
        messages.warning(request, form.errors)
        return redirect('group:update', group.slug)


class RequestAdminRightsView(LoginRequiredMixin, FormView):
    raise_exception = True
    form_class = AdminRightsRequestForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object'] = Group.get_group_by_slug(self.kwargs['group_slug'])
        return context

    def form_valid(self, form):
        messages.success(
            self.request, 'Votre demande a été enregistré, on revient rapidement avec une réponse.')
        object = form.save(commit=False)
        object.student = self.request.user.student
        object.group = self.kwargs['group_slug']
        object.save(domain=get_current_site(self.request).domain)
        return super().form_valid(form)

    def get_success_url(self) -> str:
        return reverse('group:detail', kwargs={'group_slug': self.kwargs['group_slug']})


class AcceptAdminRequestView(UserIsAdmin, View):
    def get(self, request, group_slug, id):
        admin_req = AdminRightsRequest.objects.get(id=id)
        messages.success(
            request, message=f"Vous avez accepté la demande de {admin_req.student}")
        admin_req.accept()
        return redirect('group:update', group_slug)


class DenyAdminRequestView(UserIsAdmin, View):
    def get(self, request, group_slug, id):
        admin_req = AdminRightsRequest.objects.get(id=id)
        messages.success(
            request, message=f"Vous avez refusé la demande de {admin_req.student}")
        admin_req.deny()
        return redirect('group:update', group_slug)
