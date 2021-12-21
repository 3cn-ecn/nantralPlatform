from django.urls import path

from .api_views import *

app_name = 'notification_api'

urlpatterns = [
     path(
          'subscription', 
          SubscriptionAPIView.as_view(), 
          name='subscription'
     ),
     path(
          'my_notifications', 
          NotificationAPIView.as_view(),
          name='my_notifications'
     )
]
