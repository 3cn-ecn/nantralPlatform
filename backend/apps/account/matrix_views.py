from django.conf import settings
from django.contrib.auth import authenticate

from rest_framework import (
    authentication,
    exceptions,
    permissions,
    response,
    views,
)

from apps.account.models import User


class CheckCredentials(views.APIView):
    """
    A class to authenticate users for matrix servers using a custom auth provider
    """

    # Basic authentication to avoid CSRF
    # This is not a problem because we do not log the user in
    authentication_classes = [authentication.BasicAuthentication]
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get("user").get("id")
        password = request.data.get("user").get("password")
        email = request.data.get("user").get("email")

        # Check authentication method (email, matrix id or username)
        if username:
            if username[0] == "@":  # Check for matrix id and convert to username
                username = username.split(":")[0][1:]
            email = User.objects.get(username=username).email

        user = authenticate(username=email, password=password)

        # Check if the user account exists and is valid
        if (user is None) or (user.invitation is not None and not user.invitation.is_valid()) or (not user.is_email_valid):
            raise exceptions.AuthenticationFailed({"auth": {"success": False}})

        # Lock the change of username after matrix account has been created
        if not user.has_opened_matrix:
            user.has_opened_matrix = True
            user.save()

        # Return user data
        return response.Response({ "auth": {
            "success": True,
            "mxid": f"@{user.username}:{settings.MATRIX_SERVER_NAME}",
            "profile": {
                "display_name": user.student.name,
                "three_pids": [
                    {
                        "medium": "email",
                        "address": user.email
                    }
                ]
            }
        }})
