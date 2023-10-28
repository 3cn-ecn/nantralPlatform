from datetime import datetime

from django.db.models import QuerySet

from rest_framework import permissions, viewsets
from rest_framework.request import Request
from rest_framework.response import Response

from apps.account.models import User
from apps.group.models import Group, Membership
from apps.group.serializers import GroupPreviewSerializer, MembershipSerializer


class SignatureApiViewSet(viewsets.ViewSet):
    """API endpoint for signature."""

    permission_classes = [permissions.IsAuthenticated]

    def get_year(self) -> int:
        """Returns 1st year, 2nd year, or 3d year."""
        promo = self.request.user.student.promo
        year = datetime.now().year - promo
        if datetime.now().month >= 8:
            year += 1
        if year > 3:
            year = 3  # last year is 3rd year
        return year

    def get_academic_group(self) -> Group | None:
        user: User = self.request.user
        academic_group_membership = (
            user.student.membership_set.filter(
                group__group_type__slug="academic"
            )
            .order_by("-begin_date")
            .first()
        )
        if academic_group_membership is None:
            return None
        return academic_group_membership.group

    def get_club_memberships(self) -> QuerySet[Membership]:
        user: User = self.request.user
        club_memberships = user.student.membership_set.filter(
            group__group_type__slug="club",
            begin_date__lte=datetime.now(),
            end_date__gte=datetime.now(),
        ).order_by("-begin_date")
        return club_memberships

    def list(self, request: Request, *args, **kwargs):
        """Get info for a signature."""
        user: User = request.user
        email = user.email
        name = user.student.name
        year = self.get_year()
        academic_group = self.get_academic_group()
        club_memberships = self.get_club_memberships()

        return Response(
            {
                "name": name,
                "year": year,
                "email": email,
                "academic_group": (
                    GroupPreviewSerializer(academic_group).data
                    if academic_group
                    else None
                ),
                "club_memberships": MembershipSerializer(
                    club_memberships, many=True
                ).data,
            }
        )
