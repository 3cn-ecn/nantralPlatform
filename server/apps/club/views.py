from datetime import date, timedelta

from django.shortcuts import redirect, render
from django.urls.base import reverse
from django.views.generic import ListView, View, FormView, TemplateView

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.sites.shortcuts import get_current_site
from django.views.decorators.http import require_http_methods


from apps.group.views import *
# from apps.group.models import AdminRightsRequest, Group
from apps.club.models import Club, NamedMembershipClub, BDX
# from apps.liste.models import Liste, NamedMembershipList
# from apps.sociallink.models import SocialNetwork, SocialLink
# from apps.event.models import BaseEvent
# from apps.post.models import Post

# from apps.group.forms import AdminRightsRequestForm
# from apps.club.forms import NamedMembershipClubFormset, NamedMembershipAddClub, UpdateClubForm
# from apps.liste.forms import NamedMembershipAddListe, NamedMembershipListeFormset

# from apps.utils.accessMixins import UserIsAdmin

def complete_slug(mini_slug):
    clubs = Club.objects.filter(slug = 'club--'+mini_slug)
    if clubs:
        return 'club--'+mini_slug
    else:
        return 'bdx--'+mini_slug


class ListClubView(ListView):
    model = Club
    template_name = 'club/list.html'

    def get_context_data(self, **kwargs):
        user = self.request.user
        context = super().get_context_data(**kwargs)
        if user.is_anonymous or not user.is_authenticated or not user.student:
            my_clubs = []
        else:
            my_clubs = Club.objects.filter(members__user=self.request.user)
        context['my_clubs'] = [ {
            'grouper': {'name': "Mes Clubs et Assos"},
            'list': my_clubs,
        } ]
        return context


class UpdateClubView(UpdateGroupView):
    @property
    def get_slug(self, **kwargs):
        return complete_slug(self.kwargs['group_slug'])


class UpdateClubMembersView(UpdateGroupMembersView):
    @property
    def get_slug(self, **kwargs):
        return complete_slug(self.kwargs['group_slug'])


class DetailClubView(DetailGroupView):
    @property
    def get_slug(self, **kwargs):
        return complete_slug(self.kwargs['group_slug'])

    '''
    def get_object(self, **kwargs):
        slug = self.kwargs['group_slug']
        club = Club.objects.filter(slug = 'club--'+slug)
        if club:
            return club[0]
        else:
            return BDX.objects.filter(slug = 'bdx--'+slug)[0]
    '''
    

class AddToClubView(AddToGroupView):
    @property
    def get_slug(self, **kwargs):
        return complete_slug(self.kwargs['group_slug'])


