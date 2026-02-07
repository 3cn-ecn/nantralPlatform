from django.forms import ModelForm, modelformset_factory

from apps.sociallink.models import SocialLink

from ..account.models import User
from .models import Group, Membership


class UpdateGroupForm(ModelForm):
    """Form to update an existing group."""

    class Meta:
        model = Group
        fields = [
            "name",
            "short_name",
            "label",
            "summary",
            "description",
            "meeting_place",
            "meeting_hour",
            "icon",
            "banner",
            "video1",
            "video2",
            "creation_year",
            "tags",
            "public",
            "private",
            "lock_memberships",
            "children_label",
            "archived",
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        labels = self.instance.group_type.label_set.all()
        if labels:
            self.fields["label"].queryset = labels
        else:
            del self.fields["label"]
        tags = self.instance.group_type.tag_set.all()
        if tags:
            self.fields["tags"].queryset = tags
        else:
            del self.fields["tags"]


class MembershipForm(ModelForm):
    """Form for a club page to add one self to a club."""

    class Meta:
        model = Membership
        fields = ["summary", "begin_date", "end_date", "description"]

    def __init__(
        self,
        group: Group = None,
        user: User = None,
        instance: Membership = None,
        *args,
        **kwargs,
    ):
        if not (instance or (group and user)):
            raise ValueError(
                "AddMembershipForm.__init__() required both "
                "'group' and 'user' arguments or 'instance'",
            )
        super().__init__(*args, instance=instance, **kwargs)
        # manually add the group or the user to the instance
        if not instance:
            self.instance.group = group
            self.instance.user = user
        # customize the form
        if self.instance.group.group_type.no_membership_dates:
            del self.fields["begin_date"]
            del self.fields["end_date"]


class AdminRequestForm(ModelForm):
    """Form to ask for admin rights."""

    class Meta:
        model = Membership
        fields = ["admin_request_messsage"]

    def save(self, *args, **kwargs) -> any:
        self.instance.admin_request = True
        return super().save(*args, **kwargs)


SocialLinkGroupFormset = modelformset_factory(
    SocialLink,
    fields=["network", "uri", "label"],
    extra=1,
    can_delete=True,
)
