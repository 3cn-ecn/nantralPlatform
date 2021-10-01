from django.utils import timezone

from django.shortcuts import redirect, render
from django.contrib import messages
from django.views.generic.base import TemplateView, View
from django.views.generic import UpdateView, FormView
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import resolve
from django.db.utils import IntegrityError

from .models import *
from .forms import EventForm, EventFormSet

from apps.utils.slug import *
from apps.utils.accessMixins import UserIsAdmin


# Application Event

class EventDetailView(LoginRequiredMixin, TemplateView):
    template_name = 'event/detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        self.object = BaseEvent.get_event_by_slug(
            self.kwargs.get('event_slug'))
        context['object'] = self.object
        context['group'] = self.object.get_group
        context['is_participating'] = self.object.is_participating(
            self.request.user)
        return context


# Application Group

class UpdateGroupCreateEventView(UserIsAdmin, FormView):
    """In the context of edit group, create event view."""
    template_name = 'group/edit/event/create.html'
    form_class = EventForm

    def get_app(self, **kwargs):
        return resolve(self.request.path).app_name

    def get_slug(self, **kwargs):
        return self.kwargs.get("slug")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object'] = get_object_from_slug(
            self.get_app(), self.get_slug())
        return context

    def form_valid(self, form, **kwargs):
        event = form.save(commit=False)
        event.group = get_full_slug_from_slug(self.get_app(), self.get_slug())
        try:
            event.save()
            messages.success(
                self.request, f'Vous avez programé {event.title}, le {event.date}.')
            return redirect(self.get_app()+':update-events', self.get_slug())
        except IntegrityError as e:
            messages.error(
                self.request, f"L'événement {event.title} existe déjà. Veuillez modifier l'événement existant ou changer le nom de l'événement que vous tentez d'ajouter.")
            return self.form_invalid(self.request)


class EventUpdateView(UserIsAdmin, UpdateView):
    '''In the context of edit group, update an event'''
    template_name = 'event/update.html'
    fields = ['title', 'description', 'location',
              'date', 'publicity', 'color', 'image']

    def test_func(self) -> bool:
        self.request.path = '/' + \
            get_app_from_full_slug(self.object.group) + '/'
        self.kwargs['slug'] = get_slug_from_full_slug(self.object.group)
        return super().test_func()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['event'] = self.object
        context['object'] = get_object_from_full_slug(self.object.group)
        return context

    def get_object(self, **kwargs):
        return BaseEvent.get_event_by_slug(self.kwargs['event_slug'])

    def dispatch(self, request, *args, **kwargs):
        self.object = BaseEvent.get_event_by_slug(self.kwargs['event_slug'])
        self.kwargs['slug'] = get_slug_from_full_slug(self.object.group)
        if isinstance(self.object, EatingEvent):
            self.fields = ['title', 'description', 'location',
                           'date', 'publicity', 'color', 'image', 'menu']
        return super().dispatch(request, *args, **kwargs)


class UpdateGroupEventsView(UserIsAdmin, View):
    '''In the context of edit group, show planned events'''
    template_name = 'group/edit/event/planned_edit.html'

    def get_app(self, **kwargs):
        return resolve(self.request.path).app_name

    def get_slug(self, **kwargs):
        return self.kwargs.get("slug")

    def get_context_data(self, **kwargs):
        context = {}
        context['object'] = get_object_from_slug(
            self.get_app(), self.get_slug())
        context['events'] = BaseEvent.objects.filter(
            group=get_full_slug_from_slug(self.get_app(), self.get_slug()),
            date__gte=timezone.make_aware(timezone.now().today()))
        context['form'] = EventFormSet(queryset=context['events'])
        return context

    def get(self, request, **kwargs):
        context = self.get_context_data()
        return render(request, self.template_name, context)

    def post(self, request,  **kwargs):
        object = get_object_from_slug(self.get_app(), self.get_slug())
        return edit_events(request, object)


class UpdateGroupArchivedEventsView(UserIsAdmin, View):
    '''In the context of edit group, show archived events'''
    template_name = 'group/edit/event/archived_edit.html'

    def get_app(self, **kwargs):
        return resolve(self.request.path).app_name

    def get_slug(self, **kwargs):
        return self.kwargs.get("slug")

    def get_context_data(self, **kwargs):
        context = {}
        context['object'] = get_object_from_slug(
            self.get_app(), self.get_slug())
        context['events'] = BaseEvent.objects.filter(
            group=get_full_slug_from_slug(self.get_app(), self.get_slug()),
            date__lte=timezone.make_aware(timezone.now().today()))
        context['form'] = EventFormSet(queryset=context['events'])
        return context

    def get(self, request, **kwargs):
        context = self.get_context_data()
        return render(request, self.template_name, context)

    def post(self, request,  **kwargs):
        object = get_object_from_slug(self.get_app(), self.get_slug())
        return edit_events(request, object)


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
    return redirect(group.app+':update-events', group.slug)
