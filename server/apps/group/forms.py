from django.forms import ModelForm, modelformset_factory
from .models import NamedMembershipClub, Group, Club


class NamedMembershipClubForm(ModelForm):
    class Meta:
        model = NamedMembershipClub
        fields = ['function', 'year', 'student']


class NamedMembershipAddClub(ModelForm):
    """Form for a club page to add one self to a club."""
    class Meta:
        model = NamedMembershipClub
        fields = ['function', 'year']


class NamedMembershipAddListe(ModelForm):
    """Form for a club page to add one self to a liste."""
    class Meta:
        model = NamedMembershipClub
        fields = ['function']


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
