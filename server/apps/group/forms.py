from django.forms import ModelForm
from .models import AdminRightsRequest
from apps.sociallink.models import SocialLink
from apps.club.models import Club, BDX
from apps.liste.models import Liste
from apps.roommates.models import Roommates
from apps.club.forms import *
from apps.liste.forms import *
from apps.roommates.forms import *

#NotaBene : pour un bdx, isinstance(bdx, Club)=isinstance(bdx, BDX)=True

def UpdateGroupForm(group):
    if type(group) == Club:
        return UpdateClubForm
    elif type(group) == BDX:
        return UpdateBDXForm
    elif isinstance(group, Liste):
        return UpdateListeForm
    elif isinstance(group, Roommates):
        return UpdateRoommatesForm
    else:
        return None


def NamedMembershipAddGroup(group):
    if isinstance(group, Club):
        return NamedMembershipAddClub
    elif isinstance(group, Liste):
        return NamedMembershipAddListe
    elif isinstance(group, Roommates):
        return NamedMembershipAddRoommates
    else:
        return None



def NamedMembershipGroupFormset(group):
    if isinstance(group, Club):
        return NamedMembershipClubFormset
    elif isinstance(group, Liste):
        return NamedMembershipListeFormset
    elif isinstance(group, Roommates):
        return NamedMembershipRoommatesFormset
    else:
        return None



SocialLinkGroupFormset = modelformset_factory(
    SocialLink,
    fields=['network', 'url', 'label'],
    extra=1,
    can_delete=True,
)



class AdminRightsRequestForm(ModelForm):
    class Meta:
        model = AdminRightsRequest
        fields = ['reason']
