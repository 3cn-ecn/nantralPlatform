from django.urls import include, path

from rest_framework.routers import DefaultRouter

from .api_views import AuthViewSet

app_name = "account_api"

router = DefaultRouter()
router.register(prefix="", basename="account", viewset=AuthViewSet)
urlpatterns = router.urls
