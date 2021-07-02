from datetime import date, timedelta

from django.shortcuts import redirect, render
from django.urls.base import reverse
from django.views.generic import ListView, View, FormView, TemplateView, DetailView

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.sites.shortcuts import get_current_site
from django.views.decorators.http import require_http_methods


from .models import AdminRightsRequest, Group
from apps.club.models import Club, NamedMembershipClub, BDX
from apps.liste.models import Liste, NamedMembershipList
from apps.sociallink.models import SocialLink
from apps.event.models import BaseEvent
from apps.post.models import Post

from .forms import UpdateGroupForm, NamedMembershipGroupForm, NamedMembershipAddGroup, NamedMembershipGroupFormset, AdminRightsRequestForm
from apps.club.forms import NamedMembershipClubFormset, NamedMembershipAddClub, UpdateClubForm
from apps.liste.forms import NamedMembershipAddListe, NamedMembershipListeFormset

from apps.utils.accessMixins import UserIsAdmin



class GroupSlugFonctions():
    # classe modèle pour définir le choix du slug
    # lorsque l'url ne précise pas le groupe
    # ex : nantral-platform.fr/club/bde

    @property
    def get_slug(self, **kwargs):
        group_type = self.kwargs.get('group_type')
        slug = self.kwargs.get("group_slug")
        # cas spécial du groupe club/bdx (mêmes urls)
        if (group_type == "club"):
            if BDX.objects.filter(slug = 'bdx--'+slug):
                return 'bdx--' + slug
            else:
                return 'club--' + slug
        #autres groupes
        elif (group_type != "group"):
            return group_type + '--' + slug
        #groupe abstrait
        else:
            return slug



class UpdateGroupView(GroupSlugFonctions, UserIsAdmin, TemplateView):
    template_name = 'group/edit/update.html'

    def get_object(self, **kwargs):
        return Group.get_group_by_slug(self.get_slug)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['group_type'] = self.kwargs.get('group_type')
        context['group_slug'] = self.kwargs.get('group_slug')
        self.object = self.get_object()
        context['object'] = self.object
        form_to_call = UpdateGroupForm(type(self.object))
        if form_to_call:
            context['form'] = form_to_call(instance=self.object)
        return context

    def post(self, request, group_slug, group_type):
        group = self.get_object()
        form_to_call = UpdateGroupForm(type(group))
        if form_to_call:
            form = form_to_call(request.POST, request.FILES, instance=group)
            form.save()
        return redirect(group_type+':update', group_slug)


class UpdateGroupMembersView(GroupSlugFonctions, UserIsAdmin, TemplateView):
    template_name = 'group/edit/members_edit.html'

    def get_object(self, **kwargs):
        return Group.get_group_by_slug(self.get_slug)
    
    def get_context_data(self, **kwargs):
        context = {}
        context['group_type'] = self.kwargs.get('group_type')
        context['group_slug'] = self.kwargs.get('group_slug')
        context['object'] = self.get_object()
        if isinstance(context['object'], Club):
            memberships = NamedMembershipClub.objects.filter(
                group=context['object'])
            membersForm = NamedMembershipClubFormset(queryset=memberships)
            context['members'] = membersForm
        return context

    #def get(self, request, group_slug):
        #return render(request, self.template_name, context=self.get_context_data(group_slug=group_slug))

    def post(self, request, group_slug, group_type):
        group = self.get_object()
        return edit_named_memberships(request, group, group_slug, group_type)


class DetailGroupView(GroupSlugFonctions, DetailView):
    template_name = 'group/detail/detail.html'
    
    def get_object(self, **kwargs):
        return Group.get_group_by_slug(self.get_slug)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['group_type'] = self.kwargs.get('group_type')
        context['group_slug'] = self.kwargs.get('group_slug')
        self.object = self.get_object()
        context['admin_req_form'] = AdminRightsRequestForm()
        context['members'] = self.object.members.through.objects.filter(group=self.object)
        if isinstance(context['object'], Club):
            context['form'] = NamedMembershipAddClub()
        elif isinstance(context['object'], Liste):
            context['form'] = NamedMembershipAddListe()
        context['sociallinks'] = SocialLink.objects.filter(slug=self.object.slug)
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


class AddToGroupView(GroupSlugFonctions, LoginRequiredMixin, FormView):
    raise_exception = True

    def get_group(self, **kwargs):
        return Group.get_group_by_slug(self.get_slug)

    def form_valid(self, form):
        self.object = form.save(commit=False)
        self.object.student = self.request.user.student
        self.object.group = self.get_group()
        self.object.save()
        return redirect(self.object.group.get_absolute_url)

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
def edit_named_memberships(request, group, group_slug, group_type):
    form_to_call = NamedMembershipGroupFormset(type(group))
    if form_to_call:
        form = form_to_call(request.POST)
    if form.is_valid():
        members = form.save(commit=False)
        for member in members:
            member.group = group
            member.save()
        for member in form.deleted_objects:
            member.delete()
        messages.success(request, 'Membres modifies')
        return redirect(group_type+':update-members', group_slug)
    else:
        messages.warning(request, form.errors)
        return redirect(group_type+':update-members', group_slug)


class RequestAdminRightsView(GroupSlugFonctions, LoginRequiredMixin, FormView):
    raise_exception = True
    form_class = AdminRightsRequestForm

    def get_group(self, **kwargs):
        return Group.get_group_by_slug(self.get_slug)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['group_type'] = self.kwargs.get('group_type')
        context['group_slug'] = self.kwargs.get('group_slug')
        context['object'] = self.get_group()
        return context

    def form_valid(self, form):
        messages.success(
            self.request, 'Votre demande a été enregistrée, on revient rapidement avec une réponse.')
        object = form.save(commit=False)
        object.student = self.request.user.student
        object.group = self.get_slug
        object.save(domain=get_current_site(self.request).domain)
        return super().form_valid(form)

    def get_success_url(self) -> str:
        group_type = self.kwargs.get('group_type')
        group_slug = self.kwargs.get('group_slug')
        return reverse(group_type+':detail', kwargs={'group_slug': group_slug})


class AcceptAdminRequestView(UserIsAdmin, View):
    def get(self, request, group_slug, id, group_type):
        admin_req = AdminRightsRequest.objects.get(id=id)
        messages.success(
            request, message=f"Vous avez accepté la demande de {admin_req.student}")
        admin_req.accept()
        return redirect(group_type+':detail', group_slug)


class DenyAdminRequestView(UserIsAdmin, View):
    def get(self, request, group_slug, id, group_type):
        admin_req = AdminRightsRequest.objects.get(id=id)
        messages.success(
            request, message=f"Vous avez refusé la demande de {admin_req.student}")
        admin_req.deny()
        return redirect(group_type+':detail', group_slug)
