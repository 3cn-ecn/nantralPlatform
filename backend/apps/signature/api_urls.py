from rest_framework.routers import DefaultRouter

from .api_views import SignatureApiViewSet

app_name = "signature"

# router for the API
router = DefaultRouter()
router.register("", SignatureApiViewSet, basename="signature")


# urls
urlpatterns = router.urls
