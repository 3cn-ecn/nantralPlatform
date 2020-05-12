from django import forms

from apps.event.models import Event

class EventGroupForm(forms.ModelForm):
    model = Event
    fields = ['title', 'description', 'lieu', 'date', 'publicity']