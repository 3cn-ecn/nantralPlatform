from django import forms

from apps.student.models import Student
from .models import AnswerFamily, Family, MembershipFamily, QuestionFamily



class CreateFamilyForm(forms.ModelForm):
    """Créer une nouvelle Famille"""
    class Meta:
        model = Family
        fields = ['name', 'summary']


class UpdateFamilyForm(forms.ModelForm):
    """Modifier une famille existante"""
    class Meta:
        model = Family
        fields = ['name', 'summary', 'non_subscribed_members']


Member2AFormset = forms.inlineformset_factory(
    parent_model=Family,
    model=MembershipFamily,
    extra=7,
    max_num=7,
    validate_max=True,
    fields=['student'],
    can_delete=True,
)


class FamilyQuestionsForm(forms.Form):

    def __init__(self, initial, *args, **kwargs):
        super(FamilyQuestionsForm, self).__init__(initial, *args, **kwargs)
        questions = QuestionFamily.objects.all()
        for question in questions:
            name = f'question-{question.pk}'
            self.fields[name] = forms.ChoiceField(
                label = question.label,
                choices = [
                    (o.value, o.text)
                    for o in question.option_set.all()
                ],
                help_text = question.details,
                widget = forms.RadioSelect
            )
            #if hasattr(initial, name):
             #   self.initial[name] = initial['name']

    def save(self, family:Family):
        """Save the answers"""
        if self.is_valid():
            answers = self.cleaned_data.items()
            print(answers)
            for question, val in answers:
                id = int(question[9:])
                AnswerFamily(
                    answer = val,
                    family = family,
                    question = QuestionFamily.objects.get(pk=id)
                ).save()


