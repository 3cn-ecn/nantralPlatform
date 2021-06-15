from datetime import date, timedelta

from django.shortcuts import redirect, render
from django.urls.base import reverse
from django.views.generic import ListView, View, FormView, TemplateView

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.sites.shortcuts import get_current_site
from django.views.decorators.http import require_http_methods


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


class ListClubView(ListView):
    model = Club
    template_name = 'club/list.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['my_clubs'] = [ {
            'grouper': {'name': "Mes Clubs et Assos"},
            'list': Club.objects.filter(members__user=self.request.user),
        } ]
        return context

