from django.urls import path

from .api_views import (
    UpdateSubscriptionView,
    MembershipFormView,
    AdminRequestFormView,
    UpdateMembershipsAPIView
)
app_name = 'api_group'

urlpatterns = [
    # used by django forms
    path('@<slug:slug>/edit-subscription/', UpdateSubscriptionView.as_view(),
         name='edit-subscription'),
    path('@<slug:slug>/edit-membership/', MembershipFormView.as_view(),
         name='edit-member'),
    path('@<slug:slug>/admin-request/', AdminRequestFormView.as_view(),
         name='admin-request'),

    # used by react
    path('club-members', UpdateMembershipsAPIView.as_view(),
         name='list-members'),
]
