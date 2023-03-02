from django.urls import path
from rest_framework.routers import DefaultRouter

from .api_views import (
    # ListEventsHomeAPIView,
    # ListAllEventsGroupAPIView,
    # ListEventsGroupAPIView,
    ListEventsParticipantsAPIView,
    ParticipateAPIView,
    FavoriteAPIView,
    EventViewSet)

app_name = 'event'

router = DefaultRouter()
router.register('', EventViewSet, basename='event')
# router.register('group')

paths = [
    path(
        '<slug:event_slug>/participants',
        ListEventsParticipantsAPIView.as_view({'get': 'list'}),
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

urlpatterns = router.urls + paths

# urlpatterns = [
#     path(
#         '',
#         ListEventsHomeAPIView.as_view(),
#         name='list-home-events'),
#     path(
#         'group/all/<slug:group>',
#         ListAllEventsGroupAPIView.as_view(),
#         name='list-all-group-events'),
#     path(
#         'group/<slug:group>',
#         ListEventsGroupAPIView.as_view(),
#         name='list-group-events'),
#     path(
#         'participating/<slug:event_slug>',
#         ListEventsParticipantsAPIView.as_view(),
#         name='list-participants'),
#     path(
#         '<slug:event_slug>/participate',
#         ParticipateAPIView.as_view(),
#         name='participate-to-event'),
#     path(
#         '<slug:event_slug>/favorite',
#         FavoriteAPIView.as_view(),
#         name='set-event-to-favorite'),
# ]
