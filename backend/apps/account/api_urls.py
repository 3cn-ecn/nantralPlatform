from django.urls import include, path

from rest_framework.routers import DefaultRouter

from .api_views import AuthViewSet, EmailViewSet, UserViewSet

app_name = "account_api"

router = DefaultRouter()
router.register(prefix="", basename="account", viewset=AuthViewSet)
router.register(prefix="email", basename="email", viewset=EmailViewSet)
router.register(prefix="user", basename="user", viewset=UserViewSet)
urlpatterns = [
    *router.urls,
    path(
        "password_reset/",
        include("django_rest_passwordreset.urls", namespace="password_reset"),
    ),
]
