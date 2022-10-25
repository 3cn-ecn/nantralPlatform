from django.forms import ModelForm, modelformset_factory

from .models import AdminRightsRequest
from apps.sociallink.models import SocialLink

from apps.club.models import Club, BDX
from apps.liste.models import Liste
from apps.roommates.models import Roommates
from apps.academic.models import Course
from apps.administration.models import Administration

import apps.club.forms as clubforms
import apps.liste.forms as listeforms
import apps.roommates.forms as roommatesforms
import apps.academic.forms as academicforms
import apps.administration.forms as adminforms


# NB : Les BDX sont aussi des instances de Club

def UpdateGroupForm(group):
    if isinstance(group, BDX):
        return clubforms.UpdateBDXForm
    elif isinstance(group, Club):
        return clubforms.UpdateClubForm
    elif isinstance(group, Liste):
        return listeforms.UpdateListeForm
    elif isinstance(group, Roommates):
        return roommatesforms.UpdateRoommatesForm
    elif isinstance(group, Course):
        return academicforms.UpdateCourseForm
    elif isinstance(group, Administration):
        return adminforms.UpdateAdministrationForm
    else:
        return None


def NamedMembershipAddGroup(group):
    if isinstance(group, Club):
        return clubforms.NamedMembershipAddClub
    elif isinstance(group, Liste):
        return listeforms.NamedMembershipAddListe
    elif isinstance(group, Roommates):
        return roommatesforms.NamedMembershipAddRoommates
    elif isinstance(group, Course):
        return academicforms.NamedMembershipAddCourse
    elif isinstance(group, Administration):
        return adminforms.NamedMembershipAddAdministration
    else:
        return None


def NamedMembershipGroupFormset(group):
    if isinstance(group, Club):
        return clubforms.NamedMembershipClubFormset
    elif isinstance(group, Liste):
        return listeforms.NamedMembershipListeFormset
    elif isinstance(group, Roommates):
        return roommatesforms.NamedMembershipRoommatesFormset
    elif isinstance(group, Course):
        return academicforms.NamedMembershipCourseFormset
    elif isinstance(group, Administration):
        return adminforms.NamedMembershipAdministrationFormset
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
