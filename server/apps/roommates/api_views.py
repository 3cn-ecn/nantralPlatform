from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

# HousingSerializer, RoommatesGroupSerializer, RoommatesMemberSerializer
from .serializers import HousingLastRoommatesSerializer
from .models import Housing, NamedMembershipRoommates, Roommates
from apps.student.models import Student
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
        now = timezone.make_aware(timezone.now())
        query = Housing.objects.filter(
            Q(Q(roommates__begin_date__lte=now) & (Q(roommates__end_date__gte=now) | Q(roommates__end_date=None))) | (Q(roommates__members=None))).distinct()
        return query


class CheckAddressView(APIView):
    """An API view to wether wether a housing already exists at selected address.
    Returns the pk if it does, None otherwise"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        query = Housing.objects.filter(address=request.data.get("address"))
        data = [{
            'pk': housing.pk,
            'name': f'{housing.address} - {housing.details} ({housing.current_roommates})'
        } for housing in query]
        return Response(data=data)


'''
class HousingView(generics.ListCreateAPIView):
    serializer_class = HousingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Housing.objects.all()



class HousingRoommates(generics.ListCreateAPIView):
    """API View to get all the housing and their current roommates"""
    serializer_class = HousingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        now = timezone.now()
        query = Housing.objects.filter(
            Q(Q(roommates__begin_date__lte=now) & (Q(roommates__end_date__gte=now) | Q(roommates__end_date=None))) | (Q(roommates__members=None))).distinct()
        return query


class RoommatesGroupView(generics.ListCreateAPIView):
    """API View to get all the groups of roommates that lived in a house."""
    serializer_class = RoommatesGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Roommates.objects.filter(housing=self.kwargs['pk'])

    def create(self, request, *args, **kwargs):
        housing = generics.get_object_or_404(Housing, pk=self.kwargs['pk'])
        copy = request.data.copy()
        copy['housing'] = housing.pk
        serializer = self.get_serializer(
            data=copy)
        # Due to the fact that the student field in the NamedMembershipRoommates Serializer
        # has to be read_only, the student id is passed as an attribute of the serializer
        # otherwise it would be cleaned out in the validated data.
        serializer.members = [] if not request.data['add_me'] else [
            {
                'student': request.user.student.id,
                'nickname': request.data['nickname'],
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
        return NamedMembershipRoommates.objects.filter(roommates=self.kwargs['pk'])

    def create(self, request, *args, **kwargs):
        group = generics.get_object_or_404(
            Roommates, id=self.kwargs['pk'])
        copy = request.data.copy()
        copy['group'] = group.id
        student = generics.get_object_or_404(
            Student, id=request.data['student'])
        serializer = self.get_serializer(data=copy)
        serializer.student = student
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class RoommatesGroupEditView(generics.RetrieveUpdateDestroyAPIView):
    """API View to update or delete a roommates group."""
    serializer_class = RoommatesGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Roommates.objects.filter(id=self.kwargs['pk'])


class RoommatesMemberView(generics.RetrieveUpdateDestroyAPIView):
    """API View to get a specific membership and update or delete it."""
    serializer_class = RoommatesMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return NamedMembershipRoommates.objects.filter(id=self.kwargs['pk'])
'''
