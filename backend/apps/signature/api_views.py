from typing import TYPE_CHECKING

from django.db.models import Max, QuerySet
from django.utils import timezone

from rest_framework import permissions, views
from rest_framework.request import Request
from rest_framework.response import Response

from apps.group.models import Group, Membership
from apps.group.serializers import GroupPreviewSerializer, MembershipSerializer

if TYPE_CHECKING:
    from apps.account.models import User

FIRST_MONTH_OF_NEW_CYCLE = 8  # August
MAX_YEAR = 3


class SignatureApiView(views.APIView):
    """API endpoint for signature."""

    permission_classes = [permissions.IsAuthenticated]

    def get_year(self) -> int:
        """Returns 1st year, 2nd year, or 3d year."""
        promo = self.request.user.promo
        year = timezone.now().year - promo
        if timezone.now().month >= FIRST_MONTH_OF_NEW_CYCLE:
            year += 1
        year = min(year, MAX_YEAR)
        return year

    def get_academic_groups(self) -> QuerySet[Group]:
        user: User = self.request.user
        academic_memberships = user.membership_set.filter(
            group__group_type__slug="academic",
        )
        max_year = academic_memberships.aggregate(
            max_year=Max("begin_date__year"),
        )["max_year"]
        return Group.objects.filter(
            membership_set__in=academic_memberships.filter(
                begin_date__year=max_year,
            ),
        )

    def get_club_memberships(self) -> QuerySet[Membership]:
        user: User = self.request.user
        club_memberships = user.membership_set.filter(
            group__group_type__slug__in=["club", "admin"],
            begin_date__lte=timezone.now(),
            end_date__gte=timezone.now(),
        ).order_by("-begin_date")
        return club_memberships

    def get(self, request: Request, *args, **kwargs):
        """Get info for a signature."""
        user: User = request.user
        email = user.email.email
        name = user.name
        year = self.get_year()
        academic_groups = self.get_academic_groups()
        club_memberships = self.get_club_memberships()

        return Response(
            {
                "name": name,
                "year": year,
                "email": email,
                "academic_groups": GroupPreviewSerializer(
                    academic_groups,
                    many=True,
                ).data,
                "club_memberships": MembershipSerializer(
                    club_memberships,
                    many=True,
                ).data,
            },
        )
