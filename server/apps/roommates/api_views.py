from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.roommates.serializers import HousingSerializer, RoommatesGroupSerializer, RoommatesMemberSerializer
from apps.roommates.models import Housing, NamedMembershipRoommates, Roommates

from apps.utils.geocoding import geocode


class SearchGeocodingView(APIView):
    """A view to query the external Geocoding service."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(data=geocode(request.GET.get("search_string")))


class CheckAddressView(APIView):
    """An API view to wether wether a housing already exists at selected address.
    Returns the pk if it does, None otherwise"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        housing = Housing.objects.get(address=request.data.get("address"))
        return Response(data=(None if housing is None else housing.pk))


class HousingView(generics.ListCreateAPIView):
    serializer_class = HousingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Housing.objects.all()

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class RoommatesGroupView(generics.ListCreateAPIView):
    """API View to get all the groups of roommates that lived in a house."""
    serializer_class = RoommatesGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Roommates.objects.filter(housing=self.kwargs['pk'])
    
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


class RoommatesMembersView(generics.ListCreateAPIView):
    """API View to list memebers of a roommates group."""
    serializer_class = RoommatesMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return NamedMembershipRoommates.objects.filter(roommates=self.kwargs['roommates'])
