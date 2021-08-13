from django import forms
from django.forms import modelformset_factory

from apps.event.models import BaseEvent


class EventForm(forms.ModelForm):
    class Meta:
        model = BaseEvent
        fields = ['title', 'description', 'location',
                  'date', 'publicity', 'color', 'image']

    def __init__(self, *args, **kwargs):
        super(EventForm, self).__init__(*args, **kwargs)
        self.fields['date'].widget.attrs['class'] = 'datepicker'


EventFormSet = modelformset_factory(
    BaseEvent,
    fields=['title', 'description', 'location',
            'date', 'publicity', 'color', 'image'],
    extra=0,
    can_delete=True,
    widgets={
        'date': forms.DateTimeInput(attrs={'class': 'datepicker'})
    }
)
