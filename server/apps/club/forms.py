from django.forms import ModelForm, modelformset_factory
from .models import NamedMembershipClub, Club, BDX



class UpdateClubForm(ModelForm):
    class Meta:
        model = Club
        fields = ['name', 'alt_name', 'summary', 'video1', 'video2', 'description', 'logo', 'banniere', 'bdx_type']


class UpdateBDXForm(ModelForm):
    class Meta:
        model = BDX
        fields = ['name', 'alt_name', 'summary', 'video1', 'video2', 'description', 'logo', 'banniere']


class NamedMembershipAddClub(ModelForm):
    """Form for a club page to add one self to a club."""
    class Meta:
        model = NamedMembershipClub
        fields = ['function', 'date_begin']


class NamedMembershipClubForm(ModelForm):
    class Meta:
        model = NamedMembershipClub
        fields = ['student', 'function', 'date_begin', 'date_end', 'admin']

NamedMembershipClubFormset = modelformset_factory(
    NamedMembershipClub,
    fields=['student', 'function', 'date_begin', 'date_end', 'admin', 'order'],
    extra=1,
    can_delete=True,
)
