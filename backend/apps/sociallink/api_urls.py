from rest_framework.routers import DefaultRouter

from .api_views import SocialLinkViewSet, SocialNetworkViewSet

app_name = "sociallink"

# router for the API
router = DefaultRouter()
router.register("socialnetwork", SocialNetworkViewSet, basename="socialnetwork")
router.register("sociallink", SocialLinkViewSet, basename="sociallink")
# urls
urlpatterns = router.urls
