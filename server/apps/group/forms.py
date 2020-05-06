from django.forms import forms, ModelForm, formset_factory, modelformset_factory
from django import forms
from .models import NamedMembership

class NamedMembershipClubForm(ModelForm):
    class Meta:
        model = NamedMembership
        fields = ['function', 'year', 'user']


class NamedMembershipStudentForm(ModelForm):
    class Meta:
        model = NamedMembership
        fields = ['function', 'year', 'group']



NamedMembershipClubFormset = modelformset_factory(
    NamedMembership,
    fields=['function', 'year', 'user'],
    extra=1,
    can_delete=True
)