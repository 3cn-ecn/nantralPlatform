from rest_framework import generics, status, permissions
from rest_framework.response import Response

from apps.roommates.serializers import HousingSerializer
from apps.roommates.models import Housing


class CreateHousingView(generics.CreateAPIView):
    serializer_class = HousingSerializer
    permission_classes = [permissions.IsAuthenticated]


class HousingView(generics.ListAPIView):
    serializer_class = HousingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Housing.objects.all()
