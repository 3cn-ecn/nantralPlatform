from django.forms import forms, ModelForm, modelformset_factory
from django import forms
from .models import NamedMembership, Group, Club

class NamedMembershipClubForm(ModelForm):
    class Meta:
        model = NamedMembership
        fields = ['function', 'year', 'student']


class NamedMembershipStudentForm(ModelForm):
    class Meta:
        model = NamedMembership
        fields = ['function', 'year', 'group']


class NamedMembershipAdd(ModelForm):
    class Meta:
        model = NamedMembership
        fields = ['function', 'year']

class UpdateClubForm(ModelForm):
    class Meta:
        model = Club
        fields = ['description', 'admins', 'logo']


NamedMembershipClubFormset = modelformset_factory(
    NamedMembership,
    fields=['function', 'year', 'student'],
    extra=1,
    can_delete=True
)