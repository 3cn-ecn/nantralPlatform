from django.views.generic import ListView, DetailView
from django.contrib.auth.mixins import LoginRequiredMixin

from apps.club.models import Club
from apps.group.models import Group
from apps.group.views import GroupSlugFonctions, BaseDetailGroupView


class ListClubView(ListView):
    model = Club
    template_name = 'club/list.html'

    def get_context_data(self, **kwargs):
        user = self.request.user
        context = super().get_context_data(**kwargs)
        if user.is_anonymous or not user.is_authenticated or not hasattr(user, 'student'):
            my_clubs = []
        else:
            my_clubs = Club.objects.filter(members__user=self.request.user)
        context['my_clubs'] = [ {
            'grouper': {'name': "Mes Clubs et Assos"},
            'list': my_clubs,
        } ]
        return context



class DetailClubView(BaseDetailGroupView):
    '''Vue de détails d'un club.'''
    pass


class DetailGroupMembersView(GroupSlugFonctions, LoginRequiredMixin, ListView):
    template_name = 'club/members.html'
    
    def get_object(self, **kwargs):
        return Group.get_group_by_slug(self.get_slug)
    
    def get_queryset(self, **kwargs):
        object = self.get_object()
        members = object.members.through.objects.filter(group=object)
        return members.order_by('year', 'order')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object'] = self.get_object()
        return context
