from rest_framework.routers import DefaultRouter

from .api_views import PostViewSet

app_name = "post"
router = DefaultRouter()
router.register("post", PostViewSet, basename="post")

urlpatterns = router.urls
