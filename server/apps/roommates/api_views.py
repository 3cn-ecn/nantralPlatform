from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.roommates.serializers import HousingSerializer, RoommatesGroupSerializer, RoommatesMemberSerializer, RoommatesHousingSerializer
from apps.roommates.models import Housing, NamedMembershipRoommates, Roommates

from apps.student.serializers import StudentSerializer

from apps.utils.geocoding import geocode

from django.utils import timezone
from django.db.models import Q, F


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
        housing = Housing.objects.filter(address=request.data.get("address"))
        return Response(data=(None if len(housing) == 0 else housing.first().get_absolute_edit_url))


class HousingView(generics.ListCreateAPIView):
    serializer_class = HousingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Housing.objects.all()

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class HousingRoommates(generics.ListCreateAPIView):
    """API View to get all the housing and their current roommates"""
    serializer_class = RoommatesHousingSerializer
    permission_classes = [permissions.IsAuthenticated]
    # TODO: Add a filter here

    def get_queryset(self):
        now = timezone.now()
        query1 = Roommates.objects.filter(
            Q(begin_date__lte=F('end_date')), Q(begin_date__lte=now), end_date__gte=now)
        query2 = Roommates.objects.filter(Q(begin_date__gt=F('end_date')), Q(
            begin_date__lte=now) | Q(end_date__gte=now))
        concat_query = query1 | query2
        return concat_query


class RoommatesGroupView(generics.ListCreateAPIView):
    """API View to get all the groups of roommates that lived in a house."""
    serializer_class = RoommatesGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Roommates.objects.filter(housing=self.kwargs['pk'])

    def create(self, request, *args, **kwargs):
        housing = generics.get_object_or_404(Housing, pk=self.kwargs['pk'])
        request.data['housing'] = housing.pk
        serializer = self.get_serializer(data=request.data)
        request.data['members'] = [] if not request.data['add_me'] else [
            {
                'nickname': request.data['nickname'],
                'roommates': ''
            }
        ]
        # Due to the fact that the student field in the NamedMembershipRoommates Serializer
        # has to be read_only, the student id is passed as an attribute of the serializer
        # otherwise it would be cleaned out in the validated data.
        serializer.members = [] if not request.data['add_me'] else [
            {
                'student': request.user.student.id
            }
        ]
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class RoommatesMembersView(generics.ListCreateAPIView):
    """API View to list members of a roommates group."""
    serializer_class = RoommatesMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return NamedMembershipRoommates.objects.filter(roommates=self.kwargs['roommates'])
