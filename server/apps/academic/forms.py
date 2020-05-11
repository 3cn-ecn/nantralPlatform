from django import forms
from .models import FollowCourse

class TakeCourseForm(forms.ModelForm):
    class Meta:
        model = FollowCourse
        fields = ['course', 'when']

TakeCourseFormSet = forms.modelformset_factory(
    FollowCourse,
    form=TakeCourseForm,
    can_delete=True,
    extra=1
)