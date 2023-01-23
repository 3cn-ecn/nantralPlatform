from django.urls import path

from .api_views import (
    UpdateSubscriptionView,
    MembershipFormView,
    AdminRequestFormView
)
app_name = 'api_group'

urlpatterns = [
    # vue generale du groupe
    path('@<slug:slug>/edit-subscription/', UpdateSubscriptionView.as_view(),
         name='edit-subscription'),
    path('@<slug:slug>/edit-membership/', MembershipFormView.as_view(),
         name='edit-member'),
    path('@<slug:slug>/admin-request/', AdminRequestFormView.as_view(),
         name='admin-request'),
]
