from django.views.generic import ListView
from django.contrib.auth.mixins import LoginRequiredMixin

from .models import Administration


class ListAdministrationView(LoginRequiredMixin, ListView):
    template_name = 'administration/list.html'
    model = Administration
