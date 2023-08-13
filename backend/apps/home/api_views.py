from rest_framework import permissions
from rest_framework.views import APIView
from django.shortcuts import redirect
from django.contrib.sites.shortcuts import get_current_site
from rest_framework import response, status

from apps.utils.github import create_issue


class CreateIssueView(APIView):
    """A view to send the data of bug report form to Github"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        create_issue(
            title=self.request.data.get("title"),
            label=self.request.data.get("type"),
            body=(
                f"{request.data.get('description')} <br/> "
                "[Clique pour découvrir qui propose ça.]"
                f"(https://{get_current_site(self.request)}"
                f"{self.request.user.student.get_absolute_url()})"),
        )
        return response.Response(status=status.HTTP_200_OK)
