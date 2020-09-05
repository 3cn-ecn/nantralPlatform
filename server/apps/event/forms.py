from django import forms
from django.forms import modelformset_factory

from apps.event.models import BaseEvent

class EventForm(forms.ModelForm):
    model = BaseEvent
    fields = ['title', 'description', 'location', 'date', 'publicity', 'color']
    def __init__(self, *args, **kwargs):
        super(EventForm, self).__init__(*args, **kwargs)
        self.fields['date'] = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'])
        self.fields['date'].widget.attrs['class'] = 'datepicker'


EventFormSet = modelformset_factory(
    BaseEvent,
    fields=['title', 'description', 'location', 'date', 'publicity', 'color'],
    extra=1,
    can_delete=True,
    widgets= {
            'date': forms.DateTimeInput(attrs={'class':'datepicker'})
        }
)
