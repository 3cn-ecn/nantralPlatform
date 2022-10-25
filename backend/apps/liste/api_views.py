from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404

from .models import Liste
from .serializers import ListeMemberSerializer


class ListListeMembersAPIView(generics.ListAPIView):
    """List all the members of a club."""
    serializer_class = ListeMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        listeSlug = self.request.query_params.get('slug')
        liste = get_object_or_404(Liste, slug=listeSlug)
        namedMemberships = liste.members.through.objects.filter(
            group=liste,
        ).order_by('student__user__first_name')
        return namedMemberships
