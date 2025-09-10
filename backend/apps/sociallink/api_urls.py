from rest_framework.routers import DefaultRouter

from .api_views import GroupSocialLinkViewSet, UserSocialLinkViewSet

app_name = "sociallink"

# router for the API
router = DefaultRouter()
router.register("group", GroupSocialLinkViewSet, basename="group")
router.register("user", UserSocialLinkViewSet, basename="student")
# urls
urlpatterns = router.urls
