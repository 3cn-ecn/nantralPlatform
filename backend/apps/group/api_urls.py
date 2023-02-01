from django.urls import path
from rest_framework.routers import DefaultRouter

from .api_views import (
    UpdateSubscriptionView,
    MembershipFormView,
    AdminRequestFormView,
    UpdateMembershipsAPIView,
    MembershipViewSet)

app_name = 'api_group'


# rooter for API: it creates all urls for a viewSet at once
# see https://www.django-rest-framework.org/api-guide/routers/#simplerouter
router = DefaultRouter()
router.register('membership', MembershipViewSet, basename='membership')


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
] + router.urls
