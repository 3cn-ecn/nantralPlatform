from django.urls import path

from .api_views import *

app_name = 'event'

urlpatterns = [
    path('', ListEventsHomeAPIView.as_view(),
         name='list-home-events'),
    path('<slug:group>', ListAllEventsGroupAPIView.as_view(),
         name='list-all-group-events'),
    path('participating/<slug:event_slug>', ListEventsParticipantsAPIView.as_view(),
         name='list-participants'),
    path('<slug:event_slug>', UpdateEventAPIView.as_view(), name='update-event'),
    path('group/<slug:group>', ListEventsGroupAPIView.as_view(),
         name='list-group-events'),
]
