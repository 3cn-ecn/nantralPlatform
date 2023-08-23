from rest_framework.routers import DefaultRouter

from .api_views import EventViewSet

app_name = "event"

router = DefaultRouter()
router.register("event", EventViewSet, basename="event")

urlpatterns = router.urls
