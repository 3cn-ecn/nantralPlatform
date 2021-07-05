from datetime import date

from django.shortcuts import redirect, render
from django.contrib import messages
from django.contrib.auth.models import User
from django.views.generic.base import TemplateView, View
from django.views.generic import UpdateView, FormView
from django.contrib.auth.decorators import login_required

from .models import *
from .forms import EventForm, EventFormSet

from apps.group.models import Group
from apps.group.views import GroupSlugFonctions
from apps.utils.accessMixins import LoginRequiredAccessMixin, UserIsAdmin


class EventDetailView(LoginRequiredAccessMixin, TemplateView):
    template_name = 'event/detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        self.object = BaseEvent.get_event_by_slug(self.kwargs.get('event_slug'))
        context['object'] = self.object
        context['group'] = self.object.get_group
        context['is_participating'] = self.object.is_participating(
            self.request.user)
        return context


class UpdateGroupCreateEventView(GroupSlugFonctions, UserIsAdmin, FormView):
    """In the context of a group, create event view."""
    template_name = 'group/edit/event/create.html'
    form_class = EventForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object'] = Group.get_group_by_slug(self.get_slug)
        context['group_type'] = self.kwargs.get('group_type')
        context['group_slug'] = self.kwargs.get('group_slug')
        return context

    def form_valid(self, form, **kwargs):
        event = form.save(commit=False)
        event.group = Group.get_group_by_slug(
            slug=self.get_slug
        ).slug
        event.save()
        group_type = self.kwargs.get('group_type')
        group_slug = self.kwargs.get('group_slug')
        return redirect(group_type+':create-event', group_slug)


class EventUpdateView(GroupSlugFonctions, UserIsAdmin, UpdateView):
    template_name = 'event/update.html'
    fields = ['title', 'description', 'location',
              'date', 'publicity', 'color', 'image']

    def test_func(self) -> bool:
        self.kwargs['group_slug'] = self.object.get_group.slug
        return super().test_func()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object'] = self.object.get_group
        context['event'] = self.object
        context['group_type'] = self.object.group.split('--')[0]
        context['group_slug'] = self.object.group.split('--')[1]
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


class UpdateGroupEventsView(GroupSlugFonctions, UserIsAdmin, View):
    template_name = 'group/edit/event/planned_edit.html'

    def get_context_data(self, **kwargs):
        context = {}
        context['object'] = Group.get_group_by_slug(self.get_slug)
        context['events'] = BaseEvent.objects.filter(
            group=self.get_slug, date__gte=date.today())
        context['form'] = EventFormSet(queryset=context['events'])
        context['group_type'] = self.kwargs.get('group_type')
        context['group_slug'] = self.kwargs.get('group_slug')
        return context

    def get(self, request, group_slug, **kwargs):
        context=self.get_context_data(group_slug=group_slug)
        return render(request, self.template_name, context)

    def post(self, request,  group_slug, group_type):
        return edit_events(request, group_slug, group_type)


class UpdateGroupArchivedEventsView(GroupSlugFonctions, UserIsAdmin, View):
    template_name = 'group/edit/event/archived_edit.html'

    def get_context_data(self, **kwargs):
        context = {}
        context['object'] = Group.get_group_by_slug(self.get_slug)
        context['events'] = BaseEvent.objects.filter(
            group=self.get_slug, date__lte=date.today())
        context['form'] = EventFormSet(queryset=context['events'])
        context['group_type'] = self.kwargs.get('group_type')
        context['group_slug'] = self.kwargs.get('group_slug')
        return context

    def get(self, request, group_slug, **kwargs):
        return render(request, self.template_name, context=self.get_context_data(group_slug=group_slug))

    def post(self, request, group_slug, group_type):
        return edit_events(request, group_slug, group_type)


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
def edit_events(request, group_slug, group_type):
    group = Group.get_group_by_slug(group_slug)
    form = EventFormSet(request.POST)
    if form.is_valid():
        events = form.save(commit=False)
        # Link each event to the group
        for event in events:
            event.group = group.slug
            event.save()
        # Delete  missing events
        for event in form.deleted_objects:
            event.delete()
        messages.success(request, 'Events  modifies')
        return redirect(group_type+':update-events', group_slug)
    else:
        messages.warning(request, form.errors)
        return redirect(group_type+':update-events', group_slug)
