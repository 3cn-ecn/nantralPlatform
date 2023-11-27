from django.urls import path

from .views import (
    AuthView,
    ConfirmEmail,
    ConfirmUser,
    ForgottenPassView,
    LogoutView,
    PasswordResetConfirmCustomView,
    PermanentAccountUpgradeView,
    RegistrationChoice,
    RegistrationView,
    TemporaryRegistrationChoice,
    TemporaryRegistrationView,
    redirect_to_student,
)

app_name = "account"

urlpatterns = [
    path("login/", AuthView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("login/confirm_email/", ConfirmEmail.as_view(), name="confirm-email"),
    path(
        "registration/choice/",
        RegistrationChoice.as_view(),
        name="registration-choice",
    ),
    path(
        "registration/choice/<uuid:invite_id>/",
        TemporaryRegistrationChoice.as_view(),
        name="temp-registration-choice",
    ),
    path("registration/", RegistrationView.as_view(), name="registration"),
    path(
        "registration/<uuid:invite_id>/",
        TemporaryRegistrationView.as_view(),
        name="temporary-registration",
    ),
    path(
        "activate/<slug:uidb64>/<slug:token>/",
        ConfirmUser.as_view(),
        name="confirm",
    ),
    path(
        "permanent/",
        PermanentAccountUpgradeView.as_view(),
        name="upgrade-permanent",
    ),
    path("forgotten/", ForgottenPassView.as_view(), name="forgotten_pass"),
    path(
        "reset_pass/<slug:token>/",
        PasswordResetConfirmCustomView.as_view(),
        name="reset_pass",
    ),
    path(
        "<slug:user_id>/student/", redirect_to_student, name="redirect-student"
    ),
]
