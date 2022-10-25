from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404

from .models import Administration
from .serializers import AdministrationMemberSerializer


class ListAdministrationMembersAPIView(generics.ListAPIView):
    """List all the members of a club."""
    serializer_class = AdministrationMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        slug = self.request.query_params.get('slug')
        administration = get_object_or_404(Administration, slug=slug)
        named_memberships = administration.members.through.objects.filter(
            group=administration,
        ).order_by('student__user__first_name')
        return named_memberships
