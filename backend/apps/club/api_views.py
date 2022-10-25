from django.http.response import HttpResponse
from rest_framework import generics, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q

from django.utils import timezone
from django.utils.dateparse import parse_date
from rest_framework.views import APIView

from .models import Club, NamedMembershipClub
from apps.student.models import Student
from .serializers import ClubSerializer, ClubMemberSerializer


class ListMyClubAPIView(generics.ListAPIView):
    """List all the clubs of a student."""
    serializer_class = ClubSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            all_members = Club.objects.filter(
                members__user=self.request.user)
            return all_members


class ListClubMembersAPIView(APIView):
    """API endpoint to interact with the members of a club."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        club_slug = request.query_params.get('slug')
        club = get_object_or_404(Club, slug=club_slug)
        date_end = timezone.make_aware(timezone.now().today())
        named_memberships = club.members.through.objects.filter(
            Q(group=club)
            & (Q(date_end__isnull=True) | Q(date_end__gt=date_end))
        ).order_by('student__user__first_name')
        serializer = ClubMemberSerializer(named_memberships, many=True)
        return Response(data=serializer.data)

    def post(self, request, *args, **kwargs):
        # Check if club's admin
        user = self.request.user

        student = Student.objects.get(user=user)
        club_slug = request.query_params.get('slug')
        club = get_object_or_404(Club, slug=club_slug)
        membership = get_object_or_404(
            NamedMembershipClub, group=club, student=student)
        if not (membership.admin or user.is_staff):
            return HttpResponse(status=403)

        edit_mode = request.data.get("editMode")
        # edit_mode == 1 -> Edit the order of the members
        # edit_mode == 2 -> Edit a member
        # edit_mode == 3 -> Delete a member
        # edit_mode == 4 -> Add a member
        if edit_mode == 1:
            new_ordered_members = request.data.get("orderedMembers")
            for member in new_ordered_members:
                NamedMembershipClub.objects.filter(
                    id=member.get("id")).update(order=member.get("order"))
            return HttpResponse(status=200)

        elif edit_mode == 2:
            id = request.data.get("id")
            role = request.data.get("role")
            begin_date = (
                parse_date(request.data.get("beginDate"))
                if request.data.get("beginDate") is not None
                else None)
            end_date = (
                parse_date(request.data.get("endDate"))
                if request.data.get("endDate") is not None
                else None)
            admin = request.data.get("admin")
            NamedMembershipClub.objects.filter(id=id).update(
                function=role,
                admin=admin,
                date_begin=begin_date,
                date_end=end_date)
            return HttpResponse(status=200)

        elif edit_mode == 3:
            id = request.data.get("id")
            NamedMembershipClub.objects.get(id=id).delete()
            return HttpResponse(status=200)

        elif edit_mode == 4:
            student_id_to_add = request.data.get("id")
            student_to_add = Student.objects.get(id=student_id_to_add)
            # Check if student already exists
            if NamedMembershipClub.objects.filter(
                    student=student_to_add, group=club).exists():
                return HttpResponse(status=403)
            admin = request.data.get("admin")
            function = request.data.get("function")
            begin_date = (
                parse_date(request.data.get("date_begin"))
                if request.data.get("beginDate") is not None
                else None)
            end_date = (
                parse_date(request.data.get("date_end"))
                if request.data.get("endDate") is not None
                else None)

            # Check if dates are valid
            if (begin_date is not None
                    and end_date is not None
                    and begin_date > end_date):
                return HttpResponse(status=500)

            if begin_date is not None:
                NamedMembershipClub.objects.create(
                    group=club,
                    student=student_to_add,
                    admin=admin,
                    function=function,
                    date_begin=begin_date,
                    date_end=end_date).save()
            else:
                NamedMembershipClub.objects.create(
                    group=club,
                    student=student_to_add,
                    admin=admin,
                    function=function).save()
            return HttpResponse(status=200)
