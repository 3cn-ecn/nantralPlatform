from django.forms import ModelForm
from .models import AdminRightsRequest
from apps.club.models import Club, BDX
from apps.liste.models import Liste
from apps.club.forms import *
from apps.liste.forms import *


def UpdateGroupForm(group):
    if group==Club:
        return UpdateClubForm
    elif group==BDX:
        return UpdateBDXForm
    else:
        return None


def NamedMembershipGroupForm(group):
    if group==Club or group==BDX:
        return NamedMembershipClubForm
    else:
        return None


def NamedMembershipAddGroup(group):
    if group==Club or group==BDX:
        return NamedMembershipAddClub
    elif group=="list":
        return NamedMembershipAddListe
    else:
        return None


def NamedMembershipGroupFormset(group):
    if group==Club or group==BDX:
        return NamedMembershipClubFormset
    elif group==Liste:
        return NamedMembershipListeFormset
    else:
        return None


class AdminRightsRequestForm(ModelForm):
    class Meta:
        model = AdminRightsRequest
        fields = ['reason']
