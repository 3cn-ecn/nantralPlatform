from django.urls import path

from .views import ListClubView
from apps.group.urls import makeGroupUrlpatterns

app_name = 'club'

urlpatterns = [
     path('', ListClubView.as_view(), name='club-list'),
] + makeGroupUrlpatterns("club")