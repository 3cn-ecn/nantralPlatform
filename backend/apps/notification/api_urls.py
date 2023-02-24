from django.urls import path

from .api_views import (
    RegisterAPIView,
    SubscriptionAPIView,
    GetNotificationsAPIView,
    ManageNotificationAPIView)

app_name = 'notification_api'

urlpatterns = [
    path(
        'register',
        RegisterAPIView.as_view(),
        name='register'
    ),
    path(
        'subscription/<slug:slug>',
        SubscriptionAPIView.as_view(),
        name='subscription'
    ),
    path(
        'get_notifications',
        GetNotificationsAPIView.as_view(),
        name='get_notifications'
    ),
    path(
        'notification/<int:notif_id>',
        ManageNotificationAPIView.as_view(),
        name="manage_notification"
    )
]
