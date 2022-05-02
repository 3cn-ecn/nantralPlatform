from django.forms import ModelForm, modelformset_factory
from .models import NamedMembershipAdministration, Administration


class UpdateAdministrationForm(ModelForm):
    class Meta:
        model = Administration
        fields = ['name', 'summary', 'video1', 'video2', 'description', 'logo', 'banniere']


class NamedMembershipAddAdministration(ModelForm):
    """Form for a administration page to add one self."""
    class Meta:
        model = NamedMembershipAdministration
        fields = ['function']


NamedMembershipAdministrationFormset = modelformset_factory(
    NamedMembershipAdministration,
    fields=['student', 'function', 'admin'],
    extra=1,
    can_delete=True
)
