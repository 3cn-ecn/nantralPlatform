from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404
from django.db.models import Q

from django.utils import timezone

from .models import Club
from .serializers import *
from apps.student.serializers import StudentSerializer


class ListMyClubAPIView(generics.ListAPIView):
    """List all the clubs of a student."""
    serializer_class = ClubSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            allMembersClub = Club.objects.filter(
                members__user=self.request.user)
            return allMembersClub


class ListClubMembersAPIView(generics.ListAPIView):
    """List all the members of a club."""
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        clubSlug = self.request.query_params.get('slug')
        club = get_object_or_404(Club, slug=clubSlug)
        date_end = timezone.make_aware(timezone.now().today())
        namedMemberships = club.members.through.objects.filter(
            Q(group=club) & (Q(date_end__isnull=True) | Q(date_end__gt=date_end))
        ).order_by('student__user__first_name')
        allMembers = []
        for membership in namedMemberships:
            allMembers.append(membership.student)
        return allMembers
