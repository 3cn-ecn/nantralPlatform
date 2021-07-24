from django.views.generic import CreateView, UpdateView, ListView
from django.shortcuts import redirect
from apps.utils.accessMixins import UserIsAdmin
from .models import Service

from apps.group.models import Group
from apps.group.views import GroupSlugFonctions


class UpdateGroupListServicesView(GroupSlugFonctions, UserIsAdmin, ListView):
    model = Service
    template_name = 'booking/update/service/list.html'

    def get_queryset(self):
        return Service.objects.filter(proposed_by=self.get_slug)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object'] = Group.get_group_by_slug(self.get_slug)
        return context


class CreateServiceView(GroupSlugFonctions, UserIsAdmin, CreateView):
    model = Service
    fields = ['name', 'description', 'conditions', 'price', 'paiement_link']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object'] = Group.get_group_by_slug(self.get_slug)
        return context

    def form_valid(self, form):
        return super().form_valid(form)


class UpdateServiceView(UserIsAdmin, UpdateView):
    model = Service
    fields = ['name', 'description', 'conditions', 'price', 'paiement_link']
