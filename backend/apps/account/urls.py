from django.urls import path

from .views import ConfirmUser, PasswordResetConfirmRedirect

app_name = "account"

urlpatterns = [
    path(
        "activate/<uuid:email_uuid>/<slug:token>/",
        ConfirmUser.as_view(),
        name="confirm",
    ),
    path(
        "reset_password/<slug:token>/",
        PasswordResetConfirmRedirect.as_view(),
        name="reset-pass",
    ),
]
