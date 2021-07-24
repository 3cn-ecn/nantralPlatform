from django.urls import path

from .views import ListClubView, DetailGroupMembersView
from apps.group.urls import makeGroupUrlpatterns

app_name = 'club'

urlpatterns = [
     path('', ListClubView.as_view(), name='club-list'),
     path('<slug:mini_slug>/members/', DetailGroupMembersView.as_view(), name='members'),
] + makeGroupUrlpatterns("club")