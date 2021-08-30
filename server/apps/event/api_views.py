from datetime import datetime

from rest_framework import generics, permissions

from .models import BaseEvent
from .serializers import BaseEventSerializer


class ListEventsHomeAPIView(generics.ListAPIView):
    """List events for a group depending on the chosen
    time window. By default only returns current events."""
    serializer_class = BaseEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BaseEvent.objects.filter(date__gte=datetime.today())


class ListEventsGroupAPIView(generics.ListAPIView):
    """List events for a group depending on the chosen
    time window. By default only returns current events."""
    serializer_class = BaseEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.method == 'GET':
            if self.request.GET.get('view') == 'archives':
                return BaseEvent.objects.filter(group=self.kwargs['group'], date__lt=datetime.today())
            elif self.request.GET.get('view') == 'all':
                return BaseEvent.objects.filter(group=self.kwargs['group'])
        return BaseEvent.objects.filter(group=self.kwargs['group'], date__gte=datetime.today())


class UpdateEventAPIView(generics.RetrieveDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BaseEventSerializer
    lookup_field = 'slug'
    lookup_url_kwarg = 'event_slug'

    def get_queryset(self):
        return BaseEvent.objects.filter(slug=self.kwargs['event_slug'])
