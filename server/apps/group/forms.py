from django.forms import forms, ModelForm, modelformset_factory
from django import forms
from .models import NamedMembershipClub, Group, Club

class NamedMembershipClubForm(ModelForm):
    class Meta:
        model = NamedMembershipClub
        fields = ['function', 'year', 'student']


class NamedMembershipStudentForm(ModelForm):
    class Meta:
        model = NamedMembershipClub
        fields = ['function', 'year', 'club']


class NamedMembershipAdd(ModelForm):
    class Meta:
        model = NamedMembershipClub
        fields = ['function', 'year']

class UpdateClubForm(ModelForm):
    class Meta:
        model = Club
        fields = ['description', 'admins', 'logo']


NamedMembershipClubFormset = modelformset_factory(
    NamedMembershipClub,
    fields=['function', 'year', 'student'],
    extra=1,
    can_delete=True
)