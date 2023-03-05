from django.urls import path
from rest_framework.routers import DefaultRouter

from .api_views import (
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
        '<slug:event_id>/participants',
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
