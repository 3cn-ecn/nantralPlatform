from datetime import date, timedelta

from django.shortcuts import redirect, render
from django.urls.base import reverse
from django.views.generic import ListView, View, FormView, TemplateView
from .models import AdminRightsRequest, Club, Group, NamedMembershipClub, Liste, NamedMembershipList, LienSocialClub
from .forms import AdminRightsRequestForm, NamedMembershipClubFormset, NamedMembershipAddClub, NamedMembershipAddListe, NamedMembershipListeFormset, UpdateClubForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.sites.shortcuts import get_current_site
from django.views.decorators.http import require_http_methods

from apps.event.models import BaseEvent
from apps.post.models import Post


from apps.utils.accessMixins import UserIsAdmin


class ListClubView(ListView):
    model = Club
    template_name = 'club/list.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        list_bdx = [
            {'nom': 'Mes Clubs & Assos', 'list': Club.objects.filter(
                members__user=self.request.user).order_by('name')},
            {'nom': 'Associations', 'list': Club.objects.filter(
                bdx_type="Asso").order_by('name')},
            {'nom': 'Clubs BDE', 'list': Club.objects.filter(
                bdx_type="BDE").order_by('name')},
            {'nom': 'Clubs BDA', 'list': Club.objects.filter(
                bdx_type="BDA").order_by('name')},
            {'nom': 'Clubs BDS', 'list': Club.objects.filter(
                bdx_type="BDS").order_by('name')},
        ]
        context['list_bdx'] = list_bdx
        return context


class ListeListView(ListView):
    model = Liste
    template_name = 'liste/list.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        annees = []
        bdx = Liste.objects.order_by('-year', 'liste_type', 'name')
        annees.append(
            {'year_start': bdx[0].year-1, 'year_end': bdx[0].year, 'listes': []})
        for liste in bdx:
            if liste.year == annees[-1]['year_end']:
                annees[-1]['listes'].append(liste)
            else:
                annees.append({'year_start': liste.year-1,
                              'year_end': liste.year, 'listes': [liste]})
        context['annees'] = annees
        return context


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
            form = UpdateClubForm(request.POST, request.FILES, instance=group)
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
        print(f'Post {group_slug}')
        return edit_named_memberships(request, group_slug)


class DetailGroupView(TemplateView):
    template_name = 'group/detail/detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        self.object = Group.get_group_by_slug(self.kwargs['group_slug'])
        context['object'] = self.object
        context['admin_req_form'] = AdminRightsRequestForm()
        if isinstance(context['object'], Club):
            members = NamedMembershipClub.objects.filter(club=self.object)
            social = LienSocialClub.objects.filter(club=self.object)
            context['form'] = NamedMembershipAddClub()
        elif isinstance(context['object'], Liste):
            members = NamedMembershipList.objects.filter(liste=self.object)
            context['form'] = NamedMembershipAddListe()
            social = ""
        else:
            members = self.object.members
            social = ""
        context['members'] = members
        context['social'] = social
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
