from django.views.generic import ListView
from apps.utils.accessMixins import LoginRequiredAccessMixin

from apps.liste.models import Liste


class ListListeView(ListView, LoginRequiredAccessMixin):
    model = Liste
    template_name = 'liste/list.html'

