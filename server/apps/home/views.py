from django.shortcuts import render
from django.views.generic import TemplateView
from urllib import parse
from ..utils.accessMixins import LoginRequiredAccessMixin

from apps.event.models import BaseEvent
from datetime import *

# Create your views here.
class HomeView(LoginRequiredAccessMixin, TemplateView):
    template_name = 'home/home.html'
    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        context['events'] = event_sort(BaseEvent.objects.all())
        return context


def event_sort(events):
    tri = {}
    tri["Aujourd'hui"] = list()
    tri["Demain"] = list()
    tri["Jours suivants"] = list()
    for event in events:
        if event.date.date() == date.today():
            tri["Aujourd'hui"].append(event)
        elif event.date.date() == (date.today()+timedelta(days=1)):
            tri["Demain"].append(event)
        else:
            tri["Jours suivants"].append(event)
    return tri
