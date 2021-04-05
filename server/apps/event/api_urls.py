from django.urls import path

from .api_views import *

app_name = 'event'

urlpatterns = [
    path('<slug:event_slug>', UpdateEventAPIView.as_view(), name='update-event'),
    path('group/<slug:group>/', ListEventsGroupAPIView.as_view(),
         name='list-group-events'),
]
