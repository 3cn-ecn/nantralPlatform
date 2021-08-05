from datetime import date, timedelta

from django.shortcuts import redirect
from django.urls.base import reverse
from django.urls import resolve
from django.views.generic import View, FormView, TemplateView, DetailView

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.sites.shortcuts import get_current_site
from django.views.decorators.http import require_http_methods


from .models import AdminRightsRequest, Group
from apps.club.models import BDX
from apps.sociallink.models import SocialLink
from apps.event.models import BaseEvent
from apps.post.models import Post

from .forms import UpdateGroupForm, NamedMembershipAddGroup, NamedMembershipGroupFormset, SocialLinkGroupFormset, AdminRightsRequestForm

from apps.utils.accessMixins import UserIsAdmin


class GroupSlugFonctions():
    # group_type : nom de l'app correspondant au modèle demandé
    # ------------ reproduit la chaîne devant le slug dans le modèle
    # mini_slug : le slug du group, sans le type devant, reçu dans l'url
    # ex:
    # pour www.nantral-platform.fr/club/nantral-platform,
    # on a group_type=club et mini_slug=nantral-platform
    # la fonction ci-dessous renvoie alors slug="club--nantral-platform"

    @property
    def get_slug(self, **kwargs):
        #group_type = self.kwargs.get('group_type')
        app = resolve(self.request.path).app_name
        mini_slug = self.kwargs.get("mini_slug")
        # cas spécial du groupe club/bdx (mêmes urls)
        if (app == "club"):
            if BDX.objects.filter(slug='bdx--'+mini_slug):
                return 'bdx--' + mini_slug
            else:
                return 'club--' + mini_slug
        # autres groupes
        else:
            return app + '--' + mini_slug


class BaseDetailGroupView(GroupSlugFonctions, DetailView):
    '''Vue de détails d'un groupe.'''
    template_name = 'group/detail/detail.html'

    def get_object(self, **kwargs):
        return Group.get_group_by_slug(self.get_slug)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        group = context['object']
        context['admin_req_form'] = AdminRightsRequestForm()
        context['members'] = group.members.through.objects.filter(
            group=group).order_by('student__user__first_name')
        context['form'] = NamedMembershipAddGroup(group)
        context['sociallinks'] = SocialLink.objects.filter(
            slug=group.slug)
        context['is_member'] = group.is_member(self.request.user)
        if self.request.user.is_authenticated:
            context['is_admin'] = group.is_admin(self.request.user)
        else:
            context['is_admin'] = False
        context['events'] = BaseEvent.objects.filter(
            group=group.slug, date__gte=date.today()).order_by('date')
        context['posts'] = Post.objects.filter(
            group=group.slug, publication_date__gte=date.today()-timedelta(days=10)
        ).order_by('publication_date')
        return context


class DetailGroupView(BaseDetailGroupView, LoginRequiredMixin):
    pass


class AddToGroupView(GroupSlugFonctions, LoginRequiredMixin, FormView):
    '''Vue pour le bouton "Devenir Membre".'''

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
        self.form_class = NamedMembershipAddGroup(group)
        return NamedMembershipAddGroup(group)


class UpdateGroupView(GroupSlugFonctions, UserIsAdmin, TemplateView):
    '''Vue pour modifier les infos générales sur un groupe.'''

    template_name = 'group/edit/update.html'

    def get_object(self, **kwargs):
        return Group.get_group_by_slug(self.get_slug)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        self.object = self.get_object()
        context['object'] = self.object
        form_to_call = UpdateGroupForm(self.object)
        if form_to_call:
            context['form'] = form_to_call(instance=self.object)
        return context

    def post(self, request, **kwargs):
        group = self.get_object()
        form_to_call = UpdateGroupForm(group)
        if form_to_call:
            form = form_to_call(request.POST, request.FILES, instance=group)
            form.save()
        return redirect(group.group_type+':update', group.mini_slug)


class UpdateGroupMembersView(GroupSlugFonctions, UserIsAdmin, TemplateView):
    '''Vue pour modifier les membres d'un groupe.'''

    template_name = 'group/edit/members_edit.html'

    def get_object(self, **kwargs):
        return Group.get_group_by_slug(self.get_slug)

    def get_context_data(self, **kwargs):
        context = {}
        context['object'] = self.get_object()
        memberships = context['object'].members.through.objects.filter(
            group=context['object'])
        membersForm = NamedMembershipGroupFormset(
            context['object'])(queryset=memberships)
        context['members'] = membersForm
        return context

    # def get(self, request, mini_slug, group_type):
        # return render(request, self.template_name, context=self.get_context_data(mini_slug=mini_slug))

    def post(self, request, **kwargs):
        group = self.get_object()
        return edit_named_memberships(request, group)


@ require_http_methods(['POST'])
@ login_required
def edit_named_memberships(request, group):
    form_to_call = NamedMembershipGroupFormset(group)
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
        return redirect(group.group_type+':update-members', group.mini_slug)
    else:
        messages.warning(request, form.errors)
        return redirect(group.group_type+':update-members', group.mini_slug)


class UpdateGroupSocialLinksView(GroupSlugFonctions, UserIsAdmin, TemplateView):
    '''Vue pour modifier les réseaux sociaux d'un groupe.'''

    template_name = 'group/edit/sociallinks_edit.html'

    def get_object(self, **kwargs):
        return Group.get_group_by_slug(self.get_slug)

    def get_context_data(self, **kwargs):
        context = {}
        context['object'] = self.get_object()
        slug = self.get_slug
        sociallinks = SocialLink.objects.filter(slug=slug)
        sociallinksForm = SocialLinkGroupFormset(queryset=sociallinks)
        context['sociallinks'] = sociallinksForm
        return context

    # def get(self, request, mini_slug, group_type):
        # return render(request, self.template_name, context=self.get_context_data(mini_slug=mini_slug))

    def post(self, request, **kwargs):
        group = self.get_object()
        return edit_sociallinks(request, group)


@ require_http_methods(['POST'])
@ login_required
def edit_sociallinks(request, group):
    form_to_call = SocialLinkGroupFormset
    if form_to_call:
        form = form_to_call(request.POST)
    if form.is_valid():
        sociallinks = form.save(commit=False)
        for sociallink in sociallinks:
            sociallink.slug = group.slug
            sociallink.save()
        for sociallink in form.deleted_objects:
            sociallink.delete()
        messages.success(request, 'Liens modifiés')
        return redirect(group.group_type+':update-sociallinks', group.mini_slug)
    else:
        messages.warning(request, form.errors)
        return redirect(group.group_type+':update-sociallinks', group.mini_slug)



class RequestAdminRightsView(GroupSlugFonctions, LoginRequiredMixin, FormView):
    raise_exception = True
    form_class = AdminRightsRequestForm

    def get_group(self, **kwargs):
        return Group.get_group_by_slug(self.get_slug)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
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
        group = self.get_group()
        return reverse(group.group_type+':detail', kwargs={'mini_slug': group.mini_slug})


class AcceptAdminRequestView(GroupSlugFonctions, UserIsAdmin, View):
    def get(self, request, mini_slug, id, group_type):
        admin_req = AdminRightsRequest.objects.get(id=id)
        messages.success(
            request, message=f"Vous avez accepté la demande de {admin_req.student}")
        admin_req.accept()
        return redirect(group_type+':detail', mini_slug)


class DenyAdminRequestView(GroupSlugFonctions, UserIsAdmin, View):
    def get(self, request, mini_slug, id, group_type):
        admin_req = AdminRightsRequest.objects.get(id=id)
        messages.success(
            request, message=f"Vous avez refusé la demande de {admin_req.student}")
        admin_req.deny()
        return redirect(group_type+':detail', mini_slug)
