from django.forms import ModelForm, modelformset_factory
from .models import NamedMembershipCourse, Course


class UpdateCourseForm(ModelForm):
    class Meta:
        model = Course
        fields = ['name', 'alt_name', 'type', 'summary', 'logo',
                  'banniere', 'video1', 'video2', 'description']


class NamedMembershipAddCourse(ModelForm):
    """Form for a course page to add one self to a club."""
    class Meta:
        model = NamedMembershipCourse
        fields = ['year']


NamedMembershipCourseFormset = modelformset_factory(
    NamedMembershipCourse,
    fields=['student', 'year', 'admin'],
    extra=1,
    can_delete=True,
)
