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

def event_sort(events):
    tri = {}
    tri["Aujourd'hui"] = list()
    tri["Demain"] = list()
    jours = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"]
    mois = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]
    for event in events:
        if event.date.date() == date.today():
            tri["Aujourd'hui"].append(event)
        elif event.date.date() == (date.today()+timedelta(days=1)):
            tri["Demain"].append(event)
        else:
            written_date = jours[event.date.weekday()] + " " + str(event.date.day) + " " +mois[event.date.month-1]
            tri[written_date]=list()
            tri[written_date].append(event)
    return tri
