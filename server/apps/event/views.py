from django.shortcuts import render
from django.views.generic.base import TemplateView

from .models import *

class EventDetailView(TemplateView):
    template_name = 'event/event_detail.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        self.object = BaseEvent.get_event_by_slug(self.kwargs['event_slug'])
        context['object'] = self.object
        context['group'] = self.object.get_group
        context['is_participating'] = self.object.is_participating
        return context
