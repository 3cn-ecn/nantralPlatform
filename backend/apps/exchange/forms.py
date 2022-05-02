from django import forms

from .models import Exchange

class ExchangeForm(forms.ModelForm):
    class Meta:
        model = Exchange
        fields = ['got','wanted']
        labels = {
            'got' : 'Option obtenue',
            'wanted' : 'Option(s) recherchée(s)'
        }
        help_texts = {
            'wanted' : 'Maintenir “Ctrl” ou “Cmd” enfoncé pour en sélectionner plusieurs.' 
        }