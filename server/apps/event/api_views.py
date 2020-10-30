from datetime import datetime

from rest_framework import generics, status
from rest_framework.response import Response

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


class UpdateEventAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BaseEventSerializer
