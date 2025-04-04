from rest_framework.routers import DefaultRouter

from .api_views import GroupSocialLinkViewSet

app_name = "sociallink"

# router for the API
router = DefaultRouter()
router.register("sociallink", GroupSocialLinkViewSet, basename="sociallink")
# urls
urlpatterns = router.urls
