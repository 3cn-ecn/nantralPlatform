from django.urls import path

from .api_views import (
    ListEventsHomeAPIView,
    ListAllEventsGroupAPIView,
    ListEventsGroupAPIView,
    ListEventsParticipantsAPIView,
    ParticipateAPIView,
    FavoriteAPIView)

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
    path(
        '<slug:event_slug>/participate',
        ParticipateAPIView.as_view(),
        name='participate-to-event'),
    path(
        '<slug:event_slug>/favorite',
        FavoriteAPIView.as_view(),
        name='set-event-to-favorite'),
]
