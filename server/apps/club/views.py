from django.views.generic import ListView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import resolve

from apps.club.models import Club
from apps.group.views import BaseDetailGroupView

from apps.utils.slug import *


class ListClubView(TemplateView):
    template_name = 'club/list.html'

    def get_context_data(self, **kwargs):
        context = {'club_list': {}}
        clubList = {}
        if self.request.user.is_authenticated:
            allMembersClub = Club.objects.filter(members__user=self.request.user).only(
                'name', 'slug', 'logo', 'bdx_type')
            clubList.setdefault("Mes Clubs et Assos", allMembersClub)
        allClubs = Club.objects.all().select_related(
            "bdx_type").only('name', 'slug', 'logo', 'bdx_type')
        for club in allClubs:
            if club.bdx_type is None:
                clubList.setdefault("Associations", []).append(club)
            else:
                clubList.setdefault(
                    f'Clubs {club.bdx_type.name}', []).append(club)
        context['club_list'] = clubList
        return context


class DetailClubView(BaseDetailGroupView):
    '''Vue de détails d'un club.'''

    template_name = 'club/detail.html'


class DetailGroupMembersView(LoginRequiredMixin, ListView):
    template_name = 'club/members.html'

    def get_object(self, **kwargs):
        app = resolve(self.request.path).app_name
        slug = self.kwargs.get("slug")
        return get_object_from_slug(app, slug)

    def get_queryset(self, **kwargs):
        object = self.get_object()
        members = object.members.through.objects.filter(group=object)
        return members.order_by('year', 'order')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object'] = self.get_object()
        return context
