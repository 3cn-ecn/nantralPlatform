from django.shortcuts import render
from django.views.generic import TemplateView
from urllib import parse
from ..utils.accessMixins import LoginRequiredAccessMixin

from apps.event.models import Event
from datetime import *

# Create your views here.
class HomeView(LoginRequiredAccessMixin, TemplateView):
    template_name = 'home/home.html'
    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        context['events'] = Event.objects.all()
        context['events_today'] = TriEvents(Event.objects.all())['today']
        context['events_tomorrow'] = TriEvents(Event.objects.all())['tomorrow']
        context['events_nextdays'] = TriEvents(Event.objects.all())['nextdays']
        return context


def TriEvents(events):
    tri = {}
    tri['today']=list()
    tri['tomorrow']=list()
    tri['nextdays']=list()
    for event in events:
        if event.date.date() == date.today():
            tri['today'].append(event)
        elif event.date.date() == (date.today()+timedelta(days=1)):
            tri['tomorrow'].append(event)
        else:
            tri['nextdays'].append(event)
    return tri


