from django import forms
from django.forms import modelformset_factory

from apps.event.models import Event

class EventGroupForm(forms.ModelForm):
    model = Event
    fields = ['title', 'description', 'location', 'date', 'publicity']


EventGroupFormSet = modelformset_factory(
    Event,
    fields=['title', 'description', 'location', 'date', 'publicity'],
    extra=1,
    can_delete=True,
    widgets= {
            'date': forms.DateInput(attrs={'type':'date'})
        }
)
