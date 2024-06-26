from django.urls import path

from .views import (
    ConfirmEmail,
    ConfirmUser,
    PasswordResetConfirmRedirect,
    PermanentAccountUpgradeView,
    redirect_to_student,
)

app_name = "account"

urlpatterns = [
    path("login/confirm_email/", ConfirmEmail.as_view(), name="confirm-email"),
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
    path(
        "reset_password/<slug:token>/",
        PasswordResetConfirmRedirect.as_view(),
        name="reset-pass",
    ),
    path(
        "<slug:user_id>/student/",
        redirect_to_student,
        name="redirect-student",
    ),
]
