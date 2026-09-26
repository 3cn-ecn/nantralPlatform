from rest_framework.routers import DefaultRouter

from .api_views import EventViewSet, SportEventViewSet

app_name = "event"

router = DefaultRouter()
router.register("event", EventViewSet, basename="event")
router.register("sport", SportEventViewSet, basename="sport")

urlpatterns = router.urls
