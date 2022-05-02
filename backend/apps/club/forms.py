from django.forms import ModelForm, modelformset_factory, CharField
from .models import NamedMembershipClub, Club, BDX



class UpdateClubForm(ModelForm):
    class Meta:
        model = Club
        fields = ['name', 'alt_name', 'email', 'meeting_place', 'meeting_hour', 
                  'summary', 'logo', 'banniere', 'video1', 'video2', 'description']


class UpdateBDXForm(ModelForm):
    class Meta:
        model = BDX
        fields = ['name', 'alt_name', 'email', 'meeting_place', 'meeting_hour', 
                  'summary', 'logo', 'banniere', 'video1', 'video2', 'description']


class NamedMembershipAddClub(ModelForm):
    """Form for a club page to add one self to a club."""
    class Meta:
        model = NamedMembershipClub
        fields = ['function', 'date_begin', 'date_end']



NamedMembershipClubFormset = modelformset_factory(
    NamedMembershipClub,
    fields=['student', 'function', 'date_begin', 'date_end', 'admin', 'order'],
    extra=1,
    can_delete=True,
)
