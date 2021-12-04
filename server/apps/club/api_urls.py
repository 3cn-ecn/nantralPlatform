from django.urls import path

from .api_views import *

app_name = 'club'

urlpatterns = [
    path('my-clubs', ListMyClubAPIView.as_view(),
         name='list-my-clubs'),
    path('club-members', ListClubMembersAPIView.as_view(),
         name='list-members'),
]
