from django.http import HttpRequest

from rest_framework import permissions, response, status
from rest_framework.views import APIView

from apps.utils.github import create_issue


class CreateIssueView(APIView):
    """A view to send the data of bug report form to GitHub."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: HttpRequest):
        student_url = request.build_absolute_uri(
            request.user.student.get_absolute_url(),
        )
        create_issue(
            title=request.data.get("title"),
            label=request.data.get("type"),
            body=(
                f"{request.data.get('description')} <br/><br/>"
                f"[Voir l'auteur sur Nantral Platform]({student_url})"
            ),
        )
        return response.Response(status=status.HTTP_200_OK)
