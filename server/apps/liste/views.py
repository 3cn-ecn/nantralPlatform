from django.views.generic import ListView
from apps.liste.models import Liste


class ListListeView(ListView):
    model = Liste
    template_name = 'liste/list.html'

