import logging

from django.contrib.auth import authenticate

from rest_framework import (
    authentication,
    exceptions,
    permissions,
    response,
    views,
)

from apps.account.models import User

logger = logging.getLogger(__name__)

class CheckCredentials(views.APIView):
    """
    A class to authenticate users for matrix servers using a custom auth provider
    """

    # Basic authentication to avoid CSRF
    # This is not a problem because we do not log the user in
    authentication_classes = [authentication.BasicAuthentication]
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        user_data = request.data.get("user")
        if not user_data:
            raise exceptions.ValidationError({"auth": {"success": False, "details": "No user data provided"}})

        username = user_data.get("id")
        password = user_data.get("password")
        email = user_data.get("email")

        # Check authentication method (email, matrix id or username)
        if username:
            if username[0] == "@":  # Check for matrix id and convert to username
                username = username.split(":")[0][1:]
            if "@" in username:  # Username is an email address
                email = username
            else:
                try:
                    email = User.objects.get(username=username).email
                except User.DoesNotExist:
                    logger.error(f"Error authenticating matrix user: User {username} not found")
                    raise exceptions.ValidationError({"auth": {"success": False, "details": "User not found"}})

        user: User = authenticate(username=email, password=password)

        # Check if the user account exists and is valid
        if (user is None) or (user.invitation is not None and not user.invitation.is_valid()) or (not user.is_email_valid):
            raise exceptions.AuthenticationFailed({"auth": {"success": False}})

        # Lock the change of username after matrix account has been created
        if not user.has_opened_matrix:
            user.has_opened_matrix = True
            user.has_updated_username = True  # it's too late so we say they have already changed
            user.save()

        # Return user data
        return response.Response({ "auth": {
            "success": True,
            "mxid": f"@{user.username}:nantral-platform.fr",
            "profile": {
                "display_name": user.student.name,
                "three_pids": [
                    {
                        "medium": "email",
                        "address": email.email,
                    }
                    for email in user.emails.filter(is_visible=True)
                ]
            }
        }})
