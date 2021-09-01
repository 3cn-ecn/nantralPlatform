from rest_framework import generics, permissions

from .models import Club
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
