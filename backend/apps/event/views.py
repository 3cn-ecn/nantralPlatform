from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.shortcuts import redirect, get_object_or_404
from django.urls.base import reverse, reverse_lazy
from django.views.decorators.http import require_http_methods
from django.views.generic import (
    UpdateView, DetailView, CreateView, DeleteView)

from .models import BaseEvent

from apps.group.models import Group
from apps.notification.models import SentNotification


class EventDetailView(LoginRequiredMixin, DetailView):
    template_name = 'event/detail.html'
    model = BaseEvent
    slug_field = 'slug'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        event: BaseEvent = self.object
        # mark it as read
        SentNotification.objects.filter(
            student=self.request.user.student,
            notification=event.notification
        ).update(seen=True)
        # get context
        context['group'] = event.group
        context['is_participating'] = event.is_participating(
            self.request.user)
        context['is_admin'] = event.group.is_admin(self.request.user)
        context['ariane'] = [
            {
                'target': reverse('home:home'),
                'label': "Évènements"
            },
            {
                'target': '#',
                'label': event.title
            },
        ]
        return context


class EventUpdateView(UserPassesTestMixin, UpdateView):
    """Update an event"""

    template_name = 'event/update.html'
    fields = ['title', 'description', 'location',
              'date', 'publicity', 'color', 'image']
    model = BaseEvent
    slug_field = 'slug'

    def test_func(self) -> bool:
        event = self.get_object()
        return event.group.is_admin(self.request.user)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['ariane'] = [
            {
                'target': reverse('home:home'),
                'label': "Évènements"
            },
            {
                'target': self.object.get_absolute_url(),
                'label': self.object.title
            },
            {
                'target': '#',
                'label': "Modifier"
            }
        ]
        return context


class EventDeleteView(UserPassesTestMixin, DeleteView):
    """Delete an event"""

    template_name = 'event/delete.html'
    model = BaseEvent
    slug_field = 'slug'
    success_url = reverse_lazy('home:home')

    def test_func(self) -> bool:
        event = self.get_object()
        return event.group.is_admin(self.request.user)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['ariane'] = [
            {
                'target': reverse('home:home'),
                'label': "Évènements"
            },
            {
                'target': self.object.get_absolute_url(),
                'label': self.object.title
            },
            {
                'target': '#',
                'label': "Supprimer"
            }
        ]
        return context


class EventCreateView(UserPassesTestMixin, CreateView):
    """Create an event"""

    template_name = 'event/create.html'
    fields = ['title', 'description', 'location',
              'date', 'publicity', 'color', 'image']
    model = BaseEvent

    def test_func(self) -> bool:
        group = get_object_or_404(Group, slug=self.kwargs['group'])
        return group.is_admin(self.request.user)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['ariane'] = [
            {
                'target': reverse('home:home'),
                'label': "Évènements"
            },
            {
                'target': '#',
                'label': "Créer"
            }
        ]
        return context

    def form_valid(self, form):
        form.instance.group_slug = self.kwargs['group']
        return super().form_valid(form)


@require_http_methods(['GET'])
@login_required
def add_participant(request, slug):
    """Adds the user to the list of participants."""
    event = get_object_or_404(BaseEvent, slug=slug)
    event.participants.add(request.user.student)
    if request.GET.get('redirect'):
        return redirect('home:home')
    return redirect(event.get_absolute_url())


@require_http_methods(['GET'])
@login_required
def remove_participant(request, slug):
    """Removes the user from the list of participants."""
    event = get_object_or_404(BaseEvent, slug=slug)
    event.participants.remove(request.user.student)
    if request.GET.get('redirect'):
        return redirect('home:home')
    return redirect(event.get_absolute_url())
