from django.forms import forms, ModelForm, modelformset_factory
from django import forms
from .models import NamedMembership

class NamedMembershipClubForm(ModelForm):
    class Meta:
        model = NamedMembership
        fields = ['function', 'year', 'student']


class NamedMembershipStudentForm(ModelForm):
    class Meta:
        model = NamedMembership
        fields = ['function', 'year', 'group']



NamedMembershipClubFormset = modelformset_factory(
    NamedMembership,
    fields=['function', 'year', 'student'],
    extra=1,
    can_delete=True
)