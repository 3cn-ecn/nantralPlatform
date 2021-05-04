from django.urls import path

from .api_views import *

app_name = 'roommates_api'

urlpatterns = [
    path('housing/', HousingView.as_view(), name='housing'),
    path('housing/check', CheckAddressView.as_view(), name='address-check'),
    path('housing/<int:pk>/roommates',
         RoommatesGroupView.as_view(), name='housing-roommates'),
    path('roommates/<int:pk>/members',
         RoommatesMembersView.as_view(), name='roommates-member'),
    path('geocoding/', SearchGeocodingView.as_view(), name='geocoding')
]
