from rest_framework import permissions
from rest_framework.views import APIView
from django.shortcuts import redirect
from django.contrib.sites.shortcuts import get_current_site

from apps.utils.github import create_issue


class CreateIssueView(APIView):
    """A view to query the external Geocoding service."""
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
        return redirect('/')
