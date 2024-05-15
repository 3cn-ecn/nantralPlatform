# spell-checker: words listeforms
# ruff: noqa: N802

from django.forms import BaseModelFormSet, ModelForm, modelformset_factory

import apps.roommates.forms as roommatesforms
from apps.roommates.models import Roommates
from apps.sociallink.models import SocialLink

from .models import AdminRightsRequest

# NB : Les BDX sont aussi des instances de Club


def UpdateGroupForm(group: object) -> type[ModelForm] | None:
    if isinstance(group, Roommates):
        return roommatesforms.UpdateRoommatesForm
    else:
        return None


def NamedMembershipAddGroup(
    group: object,
) -> type[ModelForm] | None:
    if isinstance(group, Roommates):
        return roommatesforms.NamedMembershipAddRoommates
    else:
        return None


def NamedMembershipGroupFormset(
    group: object,
) -> type[BaseModelFormSet] | None:
    if isinstance(group, Roommates):
        return roommatesforms.NamedMembershipRoommatesFormset
    else:
        return None


SocialLinkGroupFormset = modelformset_factory(
    SocialLink,
    fields=["network", "uri", "label"],
    extra=1,
    can_delete=True,
)


class AdminRightsRequestForm(ModelForm):
    class Meta:
        model = AdminRightsRequest
        fields = ["reason"]
