from django.utils import timezone

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.db.utils import IntegrityError
from django.shortcuts import redirect, render, get_object_or_404
from django.urls import resolve
from django.urls.base import reverse
from django.views.decorators.http import require_http_methods
from django.views.generic import UpdateView, FormView, DetailView
from django.views.generic.base import View

from .models import BaseEvent
from .forms import EventForm, EventFormSet

from apps.notification.models import SentNotification
from apps.utils.slug import (
    get_object_from_slug,
    get_full_slug_from_slug)
from apps.utils.accessMixins import UserIsAdmin


# Application Event

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
        context['group'] = self.object.get_group()
        context['is_participating'] = self.object.is_participating(
            self.request.user)
        context['is_admin'] = context['group'].is_admin(self.request.user)
        context['ariane'] = [
            {
                'target': reverse('home:home'),
                'label': "Évènements"
            },
            {
                'target': '#',
                'label': self.object.title
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
        group = event.get_group()
        return group.is_admin(self.request.user)

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


# Application AbstractGroup

class UpdateGroupCreateEventView(UserIsAdmin, FormView):
    """In the context of edit group, create event view."""
    template_name = 'abstract_group/edit/event/create.html'
    form_class = EventForm

    def get_app(self, **kwargs):
        return resolve(self.request.path).app_name

    def get_slug(self, **kwargs):
        return self.kwargs.get("slug")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object'] = group = get_object_from_slug(
            self.get_app(), self.get_slug())
        context['ariane'] = [{'target': reverse(group.app + ':index'),
                              'label': group.app_name},
                             {'target': reverse(group.app + ':detail',
                                                kwargs={'slug': group.slug}),
                              'label': group.name},
                             {'target': '#',
                              'label': 'Modifier'}]
        return context

    def form_valid(self, form, **kwargs):
        event = form.save(commit=False)
        event.group = get_full_slug_from_slug(self.get_app(), self.get_slug())
        try:
            event.save()
            messages.success(
                self.request,
                f'Vous avez programé {event.title}, le {event.date}.')
            return redirect(self.get_app() + ':update-events', self.get_slug())
        except IntegrityError:
            messages.error(
                self.request,
                (f"L'événement {event.title} existe déjà. Veuillez modifier "
                 "l'événement existant ou changer le nom de l'événement que "
                 "vous tentez d'ajouter."))
            return self.form_invalid(self.request)


class UpdateGroupEventsView(UserIsAdmin, View):
    '''In the context of edit group, show planned events'''
    template_name = 'abstract_group/edit/event/planned_edit.html'

    def get_app(self, **kwargs):
        return resolve(self.request.path).app_name

    def get_slug(self, **kwargs):
        return self.kwargs.get("slug")

    def get_context_data(self, **kwargs):
        context = {}
        context['object'] = group = get_object_from_slug(
            self.get_app(), self.get_slug())
        date_gte = timezone.make_aware(timezone.now().today())
        context['events'] = BaseEvent.objects.filter(
            group=get_full_slug_from_slug(self.get_app(), self.get_slug()),
            date__gte=date_gte)
        context['form'] = EventFormSet(queryset=context['events'])
        context['ariane'] = [{'target': reverse(group.app + ':index'),
                              'label': group.app_name},
                             {'target': reverse(group.app + ':detail',
                                                kwargs={'slug': group.slug}),
                              'label': group.name},
                             {'target': '#',
                              'label': 'Modifier'}]
        return context

    def get(self, request, **kwargs):
        context = self.get_context_data()
        return render(request, self.template_name, context)

    def post(self, request, **kwargs):
        object = get_object_from_slug(self.get_app(), self.get_slug())
        return edit_events(request, object)


class UpdateGroupArchivedEventsView(UserIsAdmin, View):
    '''In the context of edit group, show archived events'''
    template_name = 'abstract_group/edit/event/archived_edit.html'

    def get_app(self, **kwargs):
        return resolve(self.request.path).app_name

    def get_slug(self, **kwargs):
        return self.kwargs.get("slug")

    def get_context_data(self, **kwargs):
        context = {}
        context['object'] = group = get_object_from_slug(
            self.get_app(), self.get_slug())
        date_lte = timezone.make_aware(timezone.now().today())
        context['events'] = BaseEvent.objects.filter(
            group=get_full_slug_from_slug(self.get_app(), self.get_slug()),
            date__lte=date_lte)
        context['form'] = EventFormSet(queryset=context['events'])
        context['ariane'] = [{'target': reverse(group.app + ':index'),
                              'label': group.app_name},
                             {'target': reverse(group.app + ':detail',
                                                kwargs={'slug': group.slug}),
                              'label': group.name},
                             {'target': '#',
                              'label': 'Modifier'}]
        return context

    def get(self, request, **kwargs):
        context = self.get_context_data()
        return render(request, self.template_name, context)

    def post(self, request, **kwargs):
        object = get_object_from_slug(self.get_app(), self.get_slug())
        return edit_events(request, object)


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


@require_http_methods(['POST'])
@login_required
def edit_events(request, group):
    form = EventFormSet(request.POST)
    if form.is_valid():
        events = form.save(commit=False)
        # Link each event to the group
        for event in events:
            event.group = group.full_slug
            event.save()
        # Delete  missing events
        for event in form.deleted_objects:
            event.delete()
        messages.success(request, 'Évènements modifiés !')
    else:
        messages.error(request, form.errors)
    return redirect(group.app + ':update-events', group.slug)
