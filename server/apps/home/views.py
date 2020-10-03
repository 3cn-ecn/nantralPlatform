from datetime import *
import requests
from django.shortcuts import render, redirect
from django.views.generic import TemplateView, FormView
from urllib import parse
from ..utils.accessMixins import LoginRequiredAccessMixin
from django.contrib import messages

from apps.event.models import BaseEvent

from config.settings.base import GITHUB_TOKEN, GITHUB_USER

from .forms import SuggestionForm

# Create your views here.
class HomeView(LoginRequiredAccessMixin, TemplateView):
    template_name = 'home/home.html'
    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        context['events'] = event_sort(BaseEvent.objects.all())
        return context

class SuggestionView(LoginRequiredAccessMixin, FormView):
    template_name = 'home/suggestions.html'
    form_class = SuggestionForm
    def form_valid(self, form):
        issue = {
            'title': form.cleaned_data['title'],
            'body': form.cleaned_data['description'] + f' <br/> Proposé par {self.request.user.email}'
        }
        requests.post('https://api.github.com/repos/RobinetFox/nantralPlatform/issues', json=issue, auth=(GITHUB_USER, GITHUB_TOKEN))
        messages.success(self.request, 'Votre suggestion a ete enregistree merci')
        return redirect('home:home')


def handler404(request, *args, **argv):
    response = render(request, '404.html', context={},status=404)
    return response


def handler500(request, *args, **argv):
    response = render(request, '500.html', context={},
                                  status=500)
    return response


def event_sort(events):
    tri = {}
    jours = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"]
    mois = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]
    for event in events:
        if event.date.date() == date.today():
            if "Aujourd'hui" in tri:
                tri["Aujourd'hui"].append(event)
            else:
                tri["Aujourd'hui"] = list()
                tri["Aujourd'hui"].append(event)
        elif event.date.date() == (date.today()+timedelta(days=1)):
            if "Demain" in tri:
                tri["Demain"].append(event)
            else:
                tri["Demain"] = list()
                tri["Demain"].append(event)
        else:
            written_date = jours[event.date.weekday()] + " " + str(event.date.day) + " " +mois[event.date.month-1]
            if written_date in tri:
                tri[written_date].append(event)
            else:
                tri[written_date]=list()
                tri[written_date].append(event)
    return tri
