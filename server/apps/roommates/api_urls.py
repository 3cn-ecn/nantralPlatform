from django.conf.urls import url
from django.urls import path

from .api_views import *

app_name = 'roommates'

urlpatterns = [
    path('housing/', HousingView.as_view(), name='housing'),
    path('housing/check', CheckAddressView.as_view(), name='address-check'),
    path('geocoding/', SearchGeocodingView.as_view(), name='geocoding')
]
