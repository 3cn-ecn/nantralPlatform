from django.shortcuts import redirect
from django.contrib.auth.models import User
from django.views.generic.base import TemplateView
from django.views.generic import UpdateView
from django.contrib.auth.decorators import login_required

from .models import *

from apps.utils.accessMixins import LoginRequiredAccessMixin, UserIsAdmin


class EventDetailView(LoginRequiredAccessMixin, TemplateView):
    template_name = 'event/detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        self.object = BaseEvent.get_event_by_slug(self.kwargs['event_slug'])
        context['object'] = self.object
        context['group'] = self.object.get_group
        context['is_participating'] = self.object.is_participating(
            self.request.user)
        return context


class EventUpdateView(UserIsAdmin, UpdateView):
    template_name = 'event/update.html'
    fields = ['title', 'description', 'location',
              'date', 'publicity', 'color', 'image']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object'] = self.object.get_group
        context['event'] = self.object
        return context

    def get_object(self, **kwargs):
        return BaseEvent.get_event_by_slug(self.kwargs['event_slug'])

    def dispatch(self, request, *args, **kwargs):
        self.object = BaseEvent.get_event_by_slug(self.kwargs['event_slug'])
        self.kwargs['group_slug'] = self.object.get_group.slug
        if isinstance(self.object, EatingEvent):
            self.fields = ['title', 'description', 'location',
                           'date', 'publicity', 'color', 'image', 'menu']
        return super().dispatch(request, *args, **kwargs)


@login_required
def add_participant(request, event_slug):
    """Adds the user to the list of participants."""
    event = BaseEvent.get_event_by_slug(event_slug)
    event.participants.add(request.user.student)
    if request.GET.get('redirect'):
        return redirect('home:home')
    return redirect(event.get_absolute_url())


@login_required
def remove_participant(request, event_slug):
    """Removes the user from the list of participants."""
    event = BaseEvent.get_event_by_slug(event_slug)
    event.participants.remove(request.user.student)
    if request.GET.get('redirect'):
        return redirect('home:home')
    return redirect(event.get_absolute_url())
