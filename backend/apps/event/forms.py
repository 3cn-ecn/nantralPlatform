from django import forms
from django.forms import modelformset_factory

from apps.event.models import Event


class EventForm(forms.ModelForm):
    class Meta:
        model = Event
        fields = ['title', 'description', 'location',
                  'start_date', 'publicity', 'color', 'image']

    def __init__(self, *args, **kwargs):
        super(EventForm, self).__init__(*args, **kwargs)
        self.fields['start_date'].widget.attrs['class'] = 'datepicker'


EventFormSet = modelformset_factory(
    Event,
    fields=['title', 'description', 'location',
            'start_date', 'publicity', 'color', 'image'],
    extra=0,
    can_delete=True,
    widgets={
        'start_date': forms.DateTimeInput(attrs={'class': 'datepicker'})
    }
)
