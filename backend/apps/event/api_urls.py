from django.urls import path

from .api_views import (
    ListEventsHomeAPIView,
    ListAllEventsGroupAPIView,
    ListEventsGroupAPIView,
    ListEventsParticipantsAPIView)

app_name = 'event'

urlpatterns = [
    path(
        '',
        ListEventsHomeAPIView.as_view(),
        name='list-home-events'),
    path(
        'group/all/<slug:group>',
        ListAllEventsGroupAPIView.as_view(),
        name='list-all-group-events'),
    path(
        'group/<slug:group>',
        ListEventsGroupAPIView.as_view(),
        name='list-group-events'),
    path(
        'participating/<slug:event_slug>',
        ListEventsParticipantsAPIView.as_view(),
        name='list-participants'),
]
