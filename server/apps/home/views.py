from datetime import *
import requests
from django.shortcuts import render, redirect
from django.views.generic import TemplateView, FormView
from ..utils.accessMixins import LoginRequiredAccessMixin
from django.contrib import messages

from apps.event.models import BaseEvent
from apps.post.models import Post

from django.conf import settings

from .forms import SuggestionForm


class HomeView(LoginRequiredAccessMixin, TemplateView):
    template_name = 'home/home.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        context['events'] = event_sort(BaseEvent.objects.filter(
            date__gte=date.today()).order_by('date'), self.request)
        context['posts'] = Post.objects.filter(
            publication_date__gte=date.today()-timedelta(days=10)).order_by('publication_date')
        return context


class SuggestionView(LoginRequiredAccessMixin, FormView):
    template_name = 'home/suggestions.html'
    form_class = SuggestionForm

    def form_valid(self, form):
        issue = {
            'title': form.cleaned_data['title'],
            'body': form.cleaned_data['description'] + f' <br/> Proposé par {self.request.user.email}'
        }
        requests.post('https://api.github.com/repos/unitrium/nantralPlatform/issues',
                      json=issue, auth=(settings.GITHUB_USER, settings.GITHUB_TOKEN))
        messages.success(
            self.request, 'Votre suggestion a ete enregistree merci')
        return redirect('home:home')


def handler404(request, *args, **argv):
    response = render(request, '404.html', context={}, status=404)
    return response


def handler500(request, *args, **argv):
    response = render(request, '500.html', context={},
                      status=500)
    return response


def event_sort(events, request):
    tri = {}
    jours = ["Lundi", "Mardi", "Mercredi",
             "Jeudi", "Vendredi", "Samedi", "Dimanche"]
    mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
            "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
    for event in events:
        if event.date.date() == date.today():
            if "Aujourd'hui" in tri:
                tri["Aujourd'hui"].append(
                    (event, event.is_participating(request.user)))
            else:
                tri["Aujourd'hui"] = list()
                tri["Aujourd'hui"].append(
                    (event, event.is_participating(request.user)))
        elif event.date.date() == (date.today()+timedelta(days=1)):
            if "Demain" in tri:
                tri["Demain"].append(
                    (event, event.is_participating(request.user)))
            else:
                tri["Demain"] = list()
                tri["Demain"].append(
                    (event, event.is_participating(request.user)))
        else:
            written_date = jours[event.date.weekday(
            )] + " " + str(event.date.day) + " " + mois[event.date.month-1]
            if written_date in tri:
                tri[written_date].append(
                    (event, event.is_participating(request.user)))
            else:
                tri[written_date] = list()
                tri[written_date].append(
                    (event, event.is_participating(request.user)))
    return tri
