from rest_framework.routers import DefaultRouter

from .api_views import SocialNetworkViewSet

app_name = "sociallink"

# router for the API
router = DefaultRouter()
router.register("socialnetwork", SocialNetworkViewSet, basename="socialnetwork")

# urls
urlpatterns = router.urls
