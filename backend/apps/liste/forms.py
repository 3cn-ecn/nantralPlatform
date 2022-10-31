from django.forms import ModelForm, modelformset_factory
from .models import NamedMembershipList, Liste


class UpdateListeForm(ModelForm):
    class Meta:
        model = Liste
        fields = ['name', 'year', 'summary', 'video1', 'video2',
                  'description', 'logo', 'banniere', 'liste_type']


class NamedMembershipAddListe(ModelForm):
    """Form for a club page to add one self to a liste."""
    class Meta:
        model = NamedMembershipList
        fields = ['function']


NamedMembershipListeFormset = modelformset_factory(
    NamedMembershipList,
    fields=['student', 'function', 'admin'],
    extra=1,
    can_delete=True
)
