from django.urls import path

from .api_views import (
    SearchGeocodingView,
    HousingView,
    CheckAddressView,
    RoommatesDetails)

app_name = 'roommates_api'

urlpatterns = [
    path('geocoding', SearchGeocodingView.as_view(), name='geocoding'),
    path('housing', HousingView.as_view(), name='housing'),
    path('housing/check', CheckAddressView.as_view(), name='address-check'),
    path(
        'roommates-details',
        RoommatesDetails.as_view(),
        name="roommates-details")
]
