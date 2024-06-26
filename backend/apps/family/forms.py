# ruff: noqa: B026

from django import forms

from .models import (
    AnswerFamily,
    AnswerMember,
    Family,
    MembershipFamily,
    QuestionFamily,
    QuestionMember,
)


class CreateFamilyForm(forms.ModelForm):
    """Créer une nouvelle Famille"""

    class Meta:
        model = Family
        fields = ["name", "summary"]


class UpdateFamilyForm(forms.ModelForm):
    """Modifier une famille existante"""

    class Meta:
        model = Family
        fields = [
            "name",
            "summary",
        ]


class MemberForDeleteForm(forms.BaseInlineFormSet):
    def _should_delete_form(self, form):
        """Return whether or not the form was marked for deletion."""
        return form.cleaned_data.get(
            "DELETE",
            False,
        ) or not form.cleaned_data.get("student", False)


Member2AFormset = forms.inlineformset_factory(
    parent_model=Family,
    model=MembershipFamily,
    extra=7,
    max_num=7,
    validate_max=True,
    fields=["student"],
    can_delete=True,
    formset=MemberForDeleteForm,
)


class FamilyQuestionsForm(forms.Form):
    def __init__(self, initial=None, *args, **kwargs):
        super().__init__(
            initial=initial,
            *args,
            **kwargs,
        )
        questions = QuestionFamily.objects.all()
        for question in questions:
            name = f"question-{question.pk}"
            self.fields[name] = forms.ChoiceField(
                label=question.label,
                choices=[(o.value, o.text) for o in question.option_set.all()],
                help_text=question.details,
                widget=forms.RadioSelect(attrs={"class": "form-check-input"}),
            )

    def save(self, family: Family):
        """Save the answers"""
        if self.is_valid():
            answers = self.cleaned_data.items()
            for question, val in answers:
                pk = int(question[9:])
                try:
                    ans = AnswerFamily.objects.get(
                        family=family,
                        question=QuestionFamily.objects.get(pk=pk),
                    )
                    ans.answer = val
                    ans.save()
                except AnswerFamily.DoesNotExist:
                    AnswerFamily.objects.create(
                        answer=val,
                        family=family,
                        question=QuestionFamily.objects.get(pk=pk),
                    )


class FamilyQuestionItiiForm(FamilyQuestionsForm):
    def __init__(self, initial=None, *args, **kwargs):
        super(FamilyQuestionsForm, self).__init__(
            initial=initial,
            *args,
            **kwargs,
        )
        question = QuestionFamily.objects.get(code_name="itii")
        name = f"question-{question.pk}"
        self.fields[name] = forms.ChoiceField(
            label=question.label,
            choices=[(o.value, o.text) for o in question.option_set.all()],
            help_text=question.details,
            widget=forms.RadioSelect(attrs={"class": "form-check-input"}),
        )


class MemberQuestionsForm(forms.Form):
    def __init__(self, page, is_2Aplus, initial, *args, **kwargs):  # noqa:N803
        super().__init__(
            initial=initial,
            *args,
            **kwargs,
        )
        self.use_required_attribute = False
        questions = QuestionMember.objects.filter(page=page)
        last_name = None
        for question in questions:
            try:
                show_question = not is_2Aplus or question.equivalent.quota < 100  # noqa: PLR2004
            except Exception:
                show_question = True
            if show_question:
                name = f"question-{question.pk}"
                self.fields[name] = forms.ChoiceField(
                    label=question.label,
                    choices=[
                        (o.value, o.text) for o in question.option_set.all()
                    ],
                    help_text=question.details,
                    widget=forms.RadioSelect(
                        attrs={"class": "form-check-input"},
                    ),
                )
                self[name].group = question.group
                if not last_name or self[name].group != self[last_name].group:
                    self[name].group_first = True
                    if last_name is not None:
                        self[last_name].group_last = True
                last_name = name
        if last_name:
            self[last_name].group_last = True

    def save(self, member: MembershipFamily):
        """Save the answers"""
        if self.is_valid():
            answers = self.cleaned_data.items()
            for question, val in answers:
                pk = int(question[9:])
                try:
                    ans = AnswerMember.objects.get(
                        member=member,
                        question=QuestionMember.objects.get(pk=pk),
                    )
                    ans.answer = val
                    ans.save()
                except AnswerMember.DoesNotExist:
                    AnswerMember.objects.create(
                        answer=val,
                        member=member,
                        question=QuestionMember.objects.get(pk=pk),
                    )
