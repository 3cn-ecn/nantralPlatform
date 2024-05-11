from typing import Any

from django.conf import settings
from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpRequest, HttpResponse
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.views import View
from django.views.decorators.http import require_http_methods
from django.views.generic import FormView, TemplateView

from django_rest_passwordreset.views import ResetPasswordValidateTokenViewSet

from apps.student.models import Student

from .forms import SignUpForm, UpgradePermanentAccountForm
from .models import User
from .tokens import account_activation_token
from .utils import send_email_confirmation, user_creation


class RegistrationView(FormView):
    template_name = "account/registration.html"
    form_class = SignUpForm

    def form_valid(self, form):
        user_creation(form, self.request)
        return redirect("home:home")


class ConfirmUser(View):
    def get(self, request, uidb64, token):
        # get the user
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return render(self.request, "account/activation_invalid.html")
        # get the associated temporary object if it exists
        is_temporary = user.invitation is not None
        # checking if the token is valid.
        if account_activation_token.check_token(user, token):
            # if valid set active true
            user.is_active = True
            user.is_email_valid = True
            if is_temporary and user.email_next:
                user.email = user.email_next
                user.email_next = ""
                user.invitation = None
                messages.warning(
                    request,
                    f"Dorénavant vous devez utiliser {user.email} pour vous "
                    "connecter.",
                )
            user.save()
            login(self.request, user)
            messages.success(request, "Votre compte est désormais actif !")
            return redirect("home:home")
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
            valid = response.status_code == 200
        except Exception:
            valid = False

        if not valid:
            return redirect(f"/account/reset_password/{token}/invalid")
        # render react page
        context = {"DJANGO_VITE_DEV_MODE": settings.DJANGO_VITE_DEV_MODE}
        response = render(request, "base_empty.html", context)
        return response


@require_http_methods(["GET"])
def redirect_to_student(request, user_id):
    user = User.objects.get(id=user_id)
    student = Student.objects.get(user=user)
    return redirect("student:update", student.pk)


class PermanentAccountUpgradeView(LoginRequiredMixin, FormView):
    form_class = UpgradePermanentAccountForm
    template_name = "account/permanent_account_upgrade.html"
    success_url = reverse_lazy("home:home")

    def get(self, request):
        if request.user.invitation is None:
            # account already permanent, redirect to home page
            return redirect("/")
        return super().get(request=request)

    def form_valid(self, form: UpgradePermanentAccountForm) -> HttpResponse:
        new_email = form.cleaned_data["email"]
        self.request.user.email_next = new_email
        self.request.user.save()
        send_email_confirmation(
            self.request.user,
            self.request,
            send_to=new_email,
        )
        return super().form_valid(form)


class ConfirmEmail(TemplateView):
    template_name = "account/confirm-email.html"

    def get(self, request, *args: Any, **kwargs: Any) -> HttpResponse:
        try:
            User.objects.get(email=request.session["email"])
        except (User.DoesNotExist, KeyError):
            return redirect("account:login")
        return super().get(request, *args, **kwargs)

    def post(self, request):
        user = User.objects.get(email=request.session["email"])
        mail = user.email
        temp_access = user.invitation is not None
        send_email_confirmation(
            user,
            self.request,
            temporary_access=temp_access,
            send_to=mail,
        )
        del self.request.session["email"]
        return redirect("account:login")
