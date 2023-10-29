from datetime import datetime

from django.db.models import Max, QuerySet

from rest_framework import permissions, views
from rest_framework.request import Request
from rest_framework.response import Response

from apps.account.models import User
from apps.group.models import Group, Membership
from apps.group.serializers import GroupPreviewSerializer, MembershipSerializer


class SignatureApiView(views.APIView):
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

    def get_academic_groups(self) -> QuerySet[Group]:
        user: User = self.request.user
        academic_memberships = user.student.membership_set.filter(
            group__group_type__slug="academic"
        )
        max_year = academic_memberships.aggregate(
            max_year=Max("begin_date__year")
        )["max_year"]
        return Group.objects.filter(
            membership_set__in=academic_memberships.filter(
                begin_date__year=max_year
            )
        )

    def get_club_memberships(self) -> QuerySet[Membership]:
        user: User = self.request.user
        club_memberships = user.student.membership_set.filter(
            group__group_type__slug="club",
            begin_date__lte=datetime.now(),
            end_date__gte=datetime.now(),
        ).order_by("-begin_date")
        return club_memberships

    def get(self, request: Request, *args, **kwargs):
        """Get info for a signature."""
        user: User = request.user
        email = user.email
        name = user.student.name
        year = self.get_year()
        academic_groups = self.get_academic_groups()
        club_memberships = self.get_club_memberships()

        return Response(
            {
                "name": name,
                "year": year,
                "email": email,
                "academic_groups": GroupPreviewSerializer(
                    academic_groups, many=True
                ).data,
                "club_memberships": MembershipSerializer(
                    club_memberships, many=True
                ).data,
            }
        )
