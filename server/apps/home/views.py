from django.shortcuts import render
from django.views.generic import TemplateView
from urllib import parse
from ..utils.accessMixins import LoginRequiredAccessMixin

from apps.event.models import Event
from datetime import datetime

# Create your views here.
class HomeView(LoginRequiredAccessMixin, TemplateView):
    template_name = 'home/home.html'
    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        context['events'] = Event.objects.all()
        return context

"""
def TriEvents(events):
    dictionnaire = {}
    for event in events:
        if event.date.date == date.today():
        
        elif event.date.date == (date.todat()+datetime.timedelta(days=1)):
"""