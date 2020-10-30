from django.conf.urls import url
from django.urls import path

from .api_views import *

app_name = 'event'

urlpatterns = [
    path('/group/<slug:group>/', ListEventsGroupAPIView.as_view(),
         name='list-group-events'),
    path('/<slug:event_slug', UpdateEventAPIView.as_view(), name='update-event')
]
