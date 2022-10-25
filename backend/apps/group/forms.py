# spell-checker: words listeforms

from typing import Type

from django.forms import ModelForm, modelformset_factory

from apps.academic.models import Course
from apps.administration.models import Administration
from apps.club.models import Club, BDX
from apps.liste.models import Liste
from apps.roommates.models import Roommates
from apps.sociallink.models import SocialLink
import apps.academic.forms as academicforms
import apps.administration.forms as adminforms
import apps.club.forms as clubforms
import apps.liste.forms as listeforms
import apps.roommates.forms as roommatesforms

from .models import AdminRightsRequest


# NB : Les BDX sont aussi des instances de Club

def UpdateGroupForm(group: object) -> Type[ModelForm]:  # noqa: N802
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


def NamedMembershipAddGroup(group: object) -> Type[ModelForm]:  # noqa: N802
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


def NamedMembershipGroupFormset(group: object) -> Type[ModelForm]:  # noqa: N802
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
