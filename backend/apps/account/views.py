from django.conf import settings
from django.contrib import messages
from django.contrib.auth import login
from django.http import HttpRequest
from django.shortcuts import redirect, render
from django.views import View

from django_rest_passwordreset.views import ResetPasswordValidateTokenViewSet
from rest_framework import status

from .models import Email
from .tokens import email_confirmation_token


class ConfirmUser(View):
    def get(self, request, email_uuid, token):
        # get the email and user
        try:
            email = Email.objects.get(uuid=email_uuid)
        except Email.DoesNotExist:
            return render(self.request, "account/activation_invalid.html")
        user = email.user

        # checking if the token is valid.
        if email_confirmation_token.check_token(email, token):
            # if valid set active true
            email.is_valid = True
            email.save()

            user.is_active = True
            if email.is_ecn_email():
                user.invitation = None
            user.save()

            login(self.request, user)
            messages.success(request, "Votre email a bien été vérifié !")
            return redirect("core:home")
        else:
            return render(self.request, "account/activation_invalid.html")


class PasswordResetConfirmRedirect(View):
    """Redirects to the same url in the frontend if the token is valid,
    else redirects to

    Parameters
    ----------
    View : _type_
        _description_
    """

    def get(self, request: HttpRequest, token):
        request.data = {"token": token}
        # validate token
        try:
            response = ResetPasswordValidateTokenViewSet(
                request=self.request,
            ).post(request=self.request)
            valid = response.status_code == status.HTTP_200_OK
        except Exception:
            valid = False

        if not valid:
            return redirect(f"/account/reset_password/{token}/invalid")
        # render react page
        context = {"DJANGO_VITE_DEV_MODE": settings.DJANGO_VITE_DEV_MODE}
        response = render(request, "base_empty.html", context)
        return response
