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
        return Response(data=serializer.data)

    def post(self, request, *args, **kwargs):
        # Check if club's admin
        user = self.request.user

        student = Student.objects.get(user=user)
        clubSlug = request.query_params.get('slug')
        club = get_object_or_404(Club, slug=clubSlug)
        toCheckIfAdmin = get_object_or_404(
            NamedMembershipClub, club=club, student=student)
        if not (toCheckIfAdmin.admin or user.is_staff):
            return HttpResponse(status=403)

        editMode = request.data.get("editMode")
        # editMode == 1 -> Edit the order of the members
        # editMode == 2 -> Edit a member
        if editMode == 1:
            newOrderedMembers = request.data.get("orderedMembers")
            for member in newOrderedMembers:
                NamedMembershipClub.objects.filter(
                    id=member.get("id")).update(order=member.get("order"))
            return HttpResponse(status=200)
        elif editMode == 2:
            id = request.data.get("id")
            role = request.data.get("role")
            beginDate = request.data.get("beginDate")
            endDate = request.data.get("endDate")
            admin = request.data.get("admin")
            NamedMembershipClub.objects.filter(
                id=id).update(function=role, admin=admin, date_begin=parse_date(beginDate), date_end=parse_date(endDate))
            return HttpResponse(status=200)
