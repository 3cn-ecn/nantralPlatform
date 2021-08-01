from rest_framework import generics, permissions
from .serializers import AvailabilitySerializer
from .models import Availabilty


class ListCreateAvailaibilites(generics.ListCreateAPIView):
    """Lists or Create availabilities for a given service."""
    serializer_class = AvailabilitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Availabilty.objects.filter(service=self.kwargs['pk'])
