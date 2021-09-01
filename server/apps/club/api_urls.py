from django.urls import path

from .api_views import *

app_name = 'event'

urlpatterns = [
    path('my-clubs', ListMyClubAPIView.as_view(),
         name='list-my-clubs'),
]
