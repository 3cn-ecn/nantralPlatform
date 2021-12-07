from django.urls import path

from .api_views import *

app_name = 'club'

urlpatterns = [
     path(
          'subscription', 
          SubscriptionAPIView.as_view(), 
          name='subscription'
     ),
]
