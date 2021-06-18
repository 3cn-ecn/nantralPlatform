from django.forms import ModelForm, modelformset_factory
from .models import NamedMembershipList


class NamedMembershipAddListe(ModelForm):
    """Form for a club page to add one self to a liste."""
    class Meta:
        model = NamedMembershipList
        fields = ['function']


NamedMembershipListeFormset = modelformset_factory(
    NamedMembershipList,
    fields=['function', 'student'],
    extra=1,
    can_delete=True
)
