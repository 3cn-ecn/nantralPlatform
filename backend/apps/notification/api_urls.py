from django.urls import path

from rest_framework.routers import DefaultRouter

from .api_views import (
    NotificationsViewSet,
    RegisterAPIView,
    SubscriptionAPIView,
)

app_name = "notification_api"

router = DefaultRouter()
router.register("notification", NotificationsViewSet, basename="notification")


urlpatterns = [
    path(
        "subscription/<slug:slug>",
        SubscriptionAPIView.as_view(),
        name="subscription",
    ),
    path("register", RegisterAPIView.as_view(), name="register"),
] + router.urls
