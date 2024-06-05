from django.utils.translation import gettext as _

from rest_framework import exceptions, generics, permissions, status

from apps.utils.github import create_issue

from .serializers import FeedbackSerializer


class CreateFeedbackView(generics.CreateAPIView):
    """A view to send the data of bug/suggestion report form to GitHub."""

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FeedbackSerializer

    def perform_create(self, serializer: FeedbackSerializer):
        data = serializer.validated_data
        student_url = self.request.build_absolute_uri(
            self.request.user.student.get_absolute_url(),
        )

        resp_code = create_issue(
            title=data["title"],
            label=data["type"],
            body=(
                f"{data['description']} <br/><br/>"
                f"[Voir l'auteur sur Nantral Platform]({student_url})"
            ),
        )

        if resp_code != status.HTTP_201_CREATED:
            raise exceptions.APIException(_("Issue creation on GitHub failed"))
