from django.urls import path

from .api_views import *

app_name = 'roommates_api'

urlpatterns = [
    path('geocoding/', SearchGeocodingView.as_view(), name='geocoding'),
    path('housing/', HousingView.as_view(), name='housing'),
    path('housing/check', CheckAddressView.as_view(), name='address-check'),
    path('housing/<int:pk>/roommates',
         RoommatesGroupView.as_view(), name='housing-roommates'),
    path('roommates/<int:pk>/members',
         RoommatesMembersView.as_view(), name='roommates-members'),
    path('roommates/<int:pk>',
         RoommatesGroupEditView.as_view(), name='roommates-group-edit'),
    path('roommates/membership/<int:pk>',
         RoommatesMemberView.as_view(), name='roommates-member'),
    path('housing/roommates', HousingRoommates.as_view(),
         name='housing-and-roommates'),
]
