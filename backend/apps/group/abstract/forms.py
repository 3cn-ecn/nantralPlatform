# spell-checker: words listeforms

from typing import Type

from django.forms import BaseModelFormSet, ModelForm, modelformset_factory

import apps.roommates.forms as roommatesforms
from apps.roommates.models import Roommates
from apps.sociallink.models import SocialLink

from .models import AdminRightsRequest

# NB : Les BDX sont aussi des instances de Club


def UpdateGroupForm(group: object) -> Type[ModelForm] | None:  # noqa: N802
    if isinstance(group, Roommates):
        return roommatesforms.UpdateRoommatesForm
    else:
        return None


def NamedMembershipAddGroup(  # noqa: N802
    group: object,
) -> Type[ModelForm] | None:
    if isinstance(group, Roommates):
        return roommatesforms.NamedMembershipAddRoommates
    else:
        return None


def NamedMembershipGroupFormset(  # noqa: N802
    group: object,
) -> Type[BaseModelFormSet] | None:
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
