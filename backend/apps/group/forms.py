from django.forms import ModelForm

from .models import AdminRightsRequest
from apps.sociallink.models import SocialLink

from apps.club.models import Club, BDX
from apps.liste.models import Liste
from apps.roommates.models import Roommates
from apps.academic.models import Course
from apps.administration.models import Administration

from apps.club.forms import *
from apps.liste.forms import *
from apps.roommates.forms import *
from apps.academic.forms import *
from apps.administration.forms import *


# NB : Les BDX sont aussi des instances de Club

def UpdateGroupForm(group):
    if isinstance(group, BDX):
        return UpdateBDXForm
    elif isinstance(group, Club):
        return UpdateClubForm
    elif isinstance(group, Liste):
        return UpdateListeForm
    elif isinstance(group, Roommates):
        return UpdateRoommatesForm
    elif isinstance(group, Course):
        return UpdateCourseForm
    elif isinstance(group, Administration):
        return UpdateAdministrationForm
    else:
        return None


def NamedMembershipAddGroup(group):
    if isinstance(group, Club):
        return NamedMembershipAddClub
    elif isinstance(group, Liste):
        return NamedMembershipAddListe
    elif isinstance(group, Roommates):
        return NamedMembershipAddRoommates
    elif isinstance(group, Course):
        return NamedMembershipAddCourse
    elif isinstance(group, Administration):
        return NamedMembershipAddAdministration
    else:
        return None


def NamedMembershipGroupFormset(group):
    if isinstance(group, Club):
        return NamedMembershipClubFormset
    elif isinstance(group, Liste):
        return NamedMembershipListeFormset
    elif isinstance(group, Roommates):
        return NamedMembershipRoommatesFormset
    elif isinstance(group, Course):
        return NamedMembershipCourseFormset
    elif isinstance(group, Administration):
        return NamedMembershipAdministrationFormset
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
