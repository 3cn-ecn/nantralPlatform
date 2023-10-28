from rest_framework.routers import DefaultRouter

from .api_views import SignatureApiViewSet

app_name = "tools"

# router for the API
router = DefaultRouter()
router.register("signature", SignatureApiViewSet, basename="signature")


# urls
urlpatterns = router.urls
