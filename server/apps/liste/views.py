from django.views.generic import ListView
from django.contrib.auth.mixins import LoginRequiredMixin

from apps.liste.models import Liste


class ListListeView(LoginRequiredMixin, ListView):
    model = Liste
    template_name = 'liste/list.html'

