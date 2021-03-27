from datetime import datetime

from rest_framework import generics

from .models import BaseEvent
from .serializers import BaseEventSerializer


class ListEventsGroupAPIView(generics.ListAPIView):
    """List events for a group depending on the chosen
    time window. By default only returns current events."""
    serializer_class = BaseEventSerializer

    def get_queryset(self):
        if self.request.GET:
            if self.request.GET.get('view') == 'archives':
                return BaseEvent.objects.filter(group=self.kwargs['group'], date__lt=datetime.today())
            elif self.request.get('view') == 'all':
                return BaseEvent.objects.filter(group=self.kwargs['group'])
        return BaseEvent.objects.filter(group=self.kwargs['group'], date__gte=datetime.today())


class UpdateEventAPIView(generics.RetrieveDestroyAPIView):
    serializer_class = BaseEventSerializer
    lookup_field = 'slug'
    lookup_url_kwarg = 'event_slug'

    def get_queryset(self):
        return BaseEvent.objects.filter(slug=self.kwargs['event_slug'])
