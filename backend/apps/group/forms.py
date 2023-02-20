from django.forms import ModelForm, modelformset_factory

from apps.sociallink.models import SocialLink
from apps.student.models import Student

from .models import Group, Membership


class UpdateGroupForm(ModelForm):
    """Form to update an existing group."""
    class Meta:
        model = Group
        fields = [
            'name',
            'short_name',
            'summary',
            'description',
            'meeting_place',
            'meeting_hour',
            'icon',
            'banner',
            'video1',
            'video2',
            'year',
            'private',
            'public',
            'children_label',
            'archived']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.instance.group_type.is_year_group:
            del self.fields['year']


class MembershipForm(ModelForm):
    """Form for a club page to add one self to a club."""

    class Meta:
        model = Membership
        fields = ['summary', 'begin_date', 'end_date', 'description']

    def __init__(
        self,
        group: Group = None,
        student: Student = None,
        instance: Membership = None,
        *args,
        **kwargs
    ):
        if not (instance or (group and student)):
            raise ValueError("AddMembershipForm.__init__() required both "
                             "'group' and 'student' arguments or 'instance'")
        super().__init__(*args, instance=instance, **kwargs)
        # manually add the group or the student to the instance
        if not instance:
            self.instance.group = group
            self.instance.student = student
        # customize the form
        if self.instance.group.group_type.is_year_group:
            del self.fields['begin_date']
            del self.fields['end_date']


class AdminRequestForm(ModelForm):
    """Form to ask for admin rights"""

    class Meta:
        model = Membership
        fields = ['admin_request_messsage']

    def save(self, *args, **kwargs) -> any:
        self.instance.admin_request = True
        return super().save(*args, **kwargs)


SocialLinkGroupFormset = modelformset_factory(
    SocialLink,
    fields=['network', 'uri', 'label'],
    extra=1,
    can_delete=True)
