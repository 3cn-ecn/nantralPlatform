# spell-checker: words listeforms
from django.forms import ModelForm, modelformset_factory
from .models import Group, Membership, GroupType

# from typing import Type

# from django.forms import ModelForm, BaseModelFormSet, modelformset_factory

# from apps.academic.models import Course
# from apps.administration.models import Administration
# from apps.club.models import Club, BDX
# from apps.liste.models import Liste
# from apps.roommates.models import Roommates
# from apps.sociallink.models import SocialLink
# import apps.academic.forms as academicforms
# import apps.administration.forms as adminforms
# import apps.club.forms as clubforms
# import apps.liste.forms as listeforms
# import apps.roommates.forms as roommatesforms

# from .models import AdminRightsRequest


class UpdateGroupForm(ModelForm):
    """Form to update an existing group."""
    class Meta:
        model = Group
        fields = [
            'name',
            'short_name',
            'summary',
            'icon',
            'banner',
            'description',
            'video1',
            'video2',
            'year',
            'anyone_can_join',
            'archived']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.instance.group_type.is_year_group:
            del self.fields['year']


class AddMembershipForm(ModelForm):
    """Form for a club page to add one self to a club."""

    class Meta:
        model = Membership
        fields = ['summary', 'begin_date', 'end_date', 'description']

    def __init__(self, group_type: GroupType, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if group_type.is_year_group:
            del self.fields['begin_date']
            del self.fields['end_date']


MembershipFormset = modelformset_factory(
    Membership,
    fields=[
        'student', 'summary', 'begin_date', 'end_date', 'admin', 'order',
        'description'],
    extra=1,
    can_delete=True,
)


# # NB : Les BDX sont aussi des instances de Club

# def UpdateGroupForm(group: object) -> Type[ModelForm] | None:  # noqa: N802
#     if isinstance(group, BDX):
#         return clubforms.UpdateBDXForm
#     elif isinstance(group, Club):
#         return clubforms.UpdateClubForm
#     elif isinstance(group, Liste):
#         return listeforms.UpdateListeForm
#     elif isinstance(group, Roommates):
#         return roommatesforms.UpdateRoommatesForm
#     elif isinstance(group, Course):
#         return academicforms.UpdateCourseForm
#     elif isinstance(group, Administration):
#         return adminforms.UpdateAdministrationForm
#     else:
#         return None


# def NamedMembershipAddGroup(  # noqa: N802
#     group: object
# ) -> Type[ModelForm] | None:
#     if isinstance(group, Club):
#         return clubforms.NamedMembershipAddClub
#     elif isinstance(group, Liste):
#         return listeforms.NamedMembershipAddListe
#     elif isinstance(group, Roommates):
#         return roommatesforms.NamedMembershipAddRoommates
#     elif isinstance(group, Course):
#         return academicforms.NamedMembershipAddCourse
#     elif isinstance(group, Administration):
#         return adminforms.NamedMembershipAddAdministration
#     else:
#         return None


# def NamedMembershipGroupFormset(  # noqa: N802
#     group: object
# ) -> Type[BaseModelFormSet] | None:
#     if isinstance(group, Club):
#         return clubforms.NamedMembershipClubFormset
#     elif isinstance(group, Liste):
#         return listeforms.NamedMembershipListeFormset
#     elif isinstance(group, Roommates):
#         return roommatesforms.NamedMembershipRoommatesFormset
#     elif isinstance(group, Course):
#         return academicforms.NamedMembershipCourseFormset
#     elif isinstance(group, Administration):
#         return adminforms.NamedMembershipAdministrationFormset
#     else:
#         return None


# SocialLinkGroupFormset = modelformset_factory(
#     SocialLink,
#     fields=['network', 'url', 'label'],
#     extra=1,
#     can_delete=True,
# )


# class AdminRightsRequestForm(ModelForm):
#     class Meta:
#         model = AdminRightsRequest
#         fields = ['reason']
