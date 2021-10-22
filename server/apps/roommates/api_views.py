from django.http.response import HttpResponse
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import HousingLastRoommatesSerializer, RoommatesSerializer
from .models import Housing, Roommates
from apps.utils.geocoding import geocode

from django.utils import timezone
from django.db.models import Q


class SearchGeocodingView(APIView):
    """A view to query the external Geocoding service."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(data=geocode(request.GET.get("search_string")))


class HousingView(generics.ListCreateAPIView):
    """API View to get all the housing and their current roommates"""
    serializer_class = HousingLastRoommatesSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        colocathlonParticipants = int(self.request.GET.get(
            'colocathlonParticipants'))
        now = timezone.now()
        if colocathlonParticipants == 1:
            query = Housing.objects.filter((
                Q(Q(roommates__begin_date__lte=now) & (Q(roommates__end_date__gte=now) | Q(roommates__end_date=None))) | Q(roommates__members=None)) & Q(roommates__colocathlon_agree=True)).distinct()
            return query
        query = Housing.objects.filter(
            Q(Q(roommates__begin_date__lte=now) & (Q(roommates__end_date__gte=now) | Q(roommates__end_date=None))) | Q(roommates__members=None)).distinct()
        return query


class CheckAddressView(APIView):
    """An API view to check whether a housing already exists at the selected address.
    Returns the pk if it does, None otherwise"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        query = Housing.objects.filter(address=request.data.get("address"))
        data = [{
            'pk': housing.pk,
            'name': f'{housing.address} - {housing.details} ({housing.current_roommates})'
        } for housing in query]
        return Response(data=data)


class RoommatesDetails(APIView):
    """An API view to return the details of a roommates instance"""
    serializer_class = RoommatesSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        roommatesSlug = self.request.GET.get(
            'slug')
        roommates = [generics.get_object_or_404(Roommates, slug=roommatesSlug)]
        serializer = self.serializer_class(roommates, many=True)
        return Response(serializer.data)

    def post(self, request):
        roommates = generics.get_object_or_404(
            Roommates, slug=request.data.get("slug"))
        if not roommates.colocathlon_agree:
            return Response(status=403)
        addOrDelete = int(request.data.get("addOrDelete"))

        # addOrDelete == 1 -> Delete user
        # addOrDelete == 0 -> Add user
        if addOrDelete == 0:
            if roommates.colocathlon_quota > roommates.colocathlon_participants.count():
                roommates.colocathlon_participants.add(request.user.student)
                return Response(status=200)
            return Response(status=403)
        roommates.colocathlon_participants.remove(request.user.student)
        return Response(status=200)
