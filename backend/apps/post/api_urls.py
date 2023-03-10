from rest_framework.routers import DefaultRouter

from .api_views import (
    PostViewSet
)

app_name = "post"
router = DefaultRouter()
router.register('', PostViewSet, basename='event')

urlpatterns = router.urls
