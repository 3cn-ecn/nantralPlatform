from django.views.generic import CreateView, UpdateView, ListView
from django.shortcuts import redirect
from apps.utils.accessMixins import UserIsAdmin
from .models import Service

from apps.group.models import Group


class UpdateGroupListServicesView(UserIsAdmin, ListView):
    model = Service
    template_name = 'booking/services/update/list.html'

    def get_queryset(self):
        return Service.objects.filter(proposed_by=self.kwargs['group_slug'])


class CreateServiceView(UserIsAdmin, CreateView):
    model = Service
    fields = ['name', 'description', 'conditions', 'price', 'paiement_link']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object'] = Group.get_group_by_slug(self.kwargs['group_slug'])
        return context


class UpdateServiceView(UserIsAdmin, UpdateView):
    model = Service
    fields = ['name', 'description', 'conditions', 'price', 'paiement_link']
