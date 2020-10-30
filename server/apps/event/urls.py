from django.conf.urls import url
from django.urls import path

from .views import *

app_name = 'event'

urlpatterns = [
    path('event/<slug:event_slug>/', EventDetailView.as_view(), name='detail'),
    path('event/<slug:event_slug>/participants/add',
         add_participant, name='add-participant'),
    path('event/<slug:event_slug>/participants/delete',
         remove_participant, name='remove-participant')
]
