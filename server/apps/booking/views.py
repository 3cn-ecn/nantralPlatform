from typing import Any, Dict, List
from django.views.generic import CreateView, UpdateView, ListView, DetailView
from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from apps.utils.accessMixins import UserIsAdmin, UserEditRightsObjectView
from .models import Availabilty, Service

from apps.group.models import Group
from apps.group.views import GroupSlugFonctions


class UpdateGroupListServicesView(GroupSlugFonctions, UserIsAdmin, ListView):
    model = Service
    template_name = 'booking/service/list.html'

    def get_queryset(self):
        return Service.objects.filter(group=self.get_slug)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object'] = Group.get_group_by_slug(self.get_slug)
        return context


class CreateServiceView(GroupSlugFonctions, UserIsAdmin, CreateView):
    model = Service
    fields = ['name', 'description', 'conditions', 'price', 'payment_link']
    template_name = 'booking/service/create.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object'] = Group.get_group_by_slug(self.get_slug)
        return context

    def form_valid(self, form):
        self.object = form.save()
        self.object.group = self.get_slug
        self.object.save()
        return HttpResponseRedirect(self.get_success_url())


class ServiceDetailView(DetailView):
    model = Service
    template_name = 'booking/service/detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        group = Group.get_group_by_slug(self.object.group)
        context['admin'] = group.is_admin(self.request.user)
        context['group'] = group
        return context


class AvailabilitiesListView(ListView):
    model = Availabilty
    template_name = 'booking/service/list.html'


class AvailabiltiesEditView(UserEditRightsObjectView):
    model = Service
    template_name = 'booking/availabilities/edit.html'

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        self.service: Service = self.get_object()
        context['service'] = self.service
        context['object'] = Group.get_group_by_slug(self.service.group)
        return context


class UpdateServiceView(UserEditRightsObjectView, UpdateView):
    model = Service
    fields = ['name', 'description', 'conditions', 'price', 'payment_link']
    template_name = 'booking/service/edit.html'

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        self.service: Service = self.get_object()
        context['service'] = self.service
        context['object'] = Group.get_group_by_slug(self.service.group)
        return context
