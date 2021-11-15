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
    """API endpoint to interact with the members of a club."""
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
        newOrderedMembers = request.data.get("orderedMembers")
        editMode = request.data.get("editMode")
        # editMode == 1 -> Edit the order of the members
        # editMode == 2 -> Edit a member
        if editMode == 1:
            for member in newOrderedMembers:
                NamedMembershipClub.objects.filter(
                    id=member.get("id")).update(order=member.get("order"))
            return HttpResponse(status=200)
