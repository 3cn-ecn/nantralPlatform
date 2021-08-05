from django.forms import ModelForm, modelformset_factory, CharField
from .models import Housing, NamedMembershipRoommates, Roommates


class CreateRoommatesForm(ModelForm):
    class Meta:
        model = Roommates
        fields = ['name', 'begin_date', 'end_date', 'summary']


class UpdateRoommatesForm(ModelForm):
    class Meta:
        model = Roommates
        fields = ['name', 'begin_date', 'end_date', 'banniere', 'video1', 'video2', 'description' ]


class UpdateHousingForm(ModelForm):
    class Meta:
        model = Housing
        fields = ['details', 'latitude', 'longitude']


class NamedMembershipAddRoommates(ModelForm):
    """Form for a club page to add one self to roommates."""
    nickname = CharField(
        max_length=100, label='Avez-vous un surnom ? (facultatif)', required=False)
    class Meta:
        model = NamedMembershipRoommates
        fields = ['nickname']


NamedMembershipRoommatesFormset = modelformset_factory(
    NamedMembershipRoommates,
    fields=['student', 'nickname', 'admin'],
    extra=1,
    can_delete=True,
)
