from django.views.generic import ListView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import resolve

from apps.club.models import Club, BDX
from apps.group.models import Group
from apps.group.views import BaseDetailGroupView

from apps.utils.slug import *

class ListClubView(TemplateView):
    template_name = 'club/list.html'

    def get_context_data(self, **kwargs):
        context = {'club_list': [] }
        try:
            context['club_list'].append({
                'grouper': "Mes Clubs et Assos",
                'list': Club.objects.filter(members__user=self.request.user).only('name', 'slug', 'logo', 'bdx_type'),
            })
        except Exception:
            pass
        club_list = Club.objects.all().select_related('bdx_type').only('name', 'slug', 'logo', 'bdx_type')
        context['club_list'].append({
            'grouper': "Associations",
            'list': club_list.filter(bdx_type__isnull=True)
        })
        for bdx in BDX.objects.all():
            context['club_list'].append({
                'grouper': f'Clubs {bdx.name}',
                'list': club_list.filter(bdx_type=bdx),
            })
        return context



class DetailClubView(BaseDetailGroupView):
    '''Vue de détails d'un club.'''
    
    template_name='club/detail.html'


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
