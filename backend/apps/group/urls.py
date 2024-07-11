from django.urls import path

from .views import (
    AcceptAdminRequestView,
    DenyAdminRequestView,
)

app_name = "group"

urlpatterns = [
    # views for admin request
    path(
        "admin-request/<int:id>/accept/",
        AcceptAdminRequestView.as_view(),
        name="accept-admin-req",
    ),
    path(
        "admin-request/<int:id>/deny/",
        DenyAdminRequestView.as_view(),
        name="deny-admin-req",
    ),
]
