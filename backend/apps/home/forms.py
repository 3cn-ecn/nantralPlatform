from django import forms

TYPE_CHOICES = ((1, ("Bug")), (2, ("Suggestion")))


class SuggestionForm(forms.Form):
    title = forms.CharField(max_length=50, required=True)
    description = forms.CharField(widget=forms.Textarea)
    suggestion_or_bug = forms.ChoiceField(
        label="Type", choices=TYPE_CHOICES, required=True
    )
