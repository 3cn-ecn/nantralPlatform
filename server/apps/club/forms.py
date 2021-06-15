from django.forms import ModelForm, modelformset_factory
from .models import NamedMembershipClub, Club


class NamedMembershipClubForm(ModelForm):
    class Meta:
        model = NamedMembershipClub
        fields = ['function', 'date_begin', 'student']


class NamedMembershipAddClub(ModelForm):
    """Form for a club page to add one self to a club."""
    class Meta:
        model = NamedMembershipClub
        fields = ['function', 'date_begin']


class UpdateClubForm(ModelForm):
    class Meta:
        model = Club
        fields = ['description', 'admins', 'logo']


NamedMembershipClubFormset = modelformset_factory(
    NamedMembershipClub,
    fields=['function', 'date_begin', 'student'],
    extra=1,
    can_delete=True
)
