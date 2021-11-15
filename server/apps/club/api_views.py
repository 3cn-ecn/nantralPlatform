from django.http.response import HttpResponse
from rest_framework import generics, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q

from django.utils import timezone
from rest_framework.views import APIView

from .models import Club, NamedMembershipClub
from .serializers import *


class ListMyClubAPIView(generics.ListAPIView):
    """List all the clubs of a student."""
    serializer_class = ClubSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            allMembersClub = Club.objects.filter(
                members__user=self.request.user)
            return allMembersClub


class ListClubMembersAPIView(APIView):
    """List all the members of a club."""
    #serializer_class = ClubMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        clubSlug = request.query_params.get('slug')
        club = get_object_or_404(Club, slug=clubSlug)
        date_end = timezone.make_aware(timezone.now().today())
        namedMemberships = club.members.through.objects.filter(
            Q(group=club) & (Q(date_end__isnull=True) | Q(date_end__gt=date_end))
        ).order_by('student__user__first_name')
        serializer = ClubMemberSerializer(namedMemberships, many=True)
        print(serializer)
        return Response(data=serializer.data)

    def post(self, request, *args, **kwargs):
        newOrderedMembers = request.POST
        for member in newOrderedMembers:
            NamedMembershipClub.objects.get(
                member["id"]).update(order=member["order"])
        return HttpResponse(status=200)
