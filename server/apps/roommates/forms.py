from django.forms import ModelForm, modelformset_factory
from .models import NamedMembershipRoommates, Roommates


class CreateRoommatesForm(ModelForm):
    class Meta:
        model = Roommates
        fields = ['name', 'begin_date', 'end_date', 'summary']


class UpdateRoommatesForm(ModelForm):
    class Meta:
        model = Roommates
        fields = ['name', 'begin_date', 'end_date', 'summary', 'video1', 'video2', 'description' ]


class NamedMembershipAddRoommates(ModelForm):
    """Form for a club page to add one self to roommates."""
    class Meta:
        model = NamedMembershipRoommates
        fields = ['nickname']


NamedMembershipRoommatesFormset = modelformset_factory(
    NamedMembershipRoommates,
    fields=['student', 'nickname', 'admin'],
    extra=1,
    can_delete=True,
)
