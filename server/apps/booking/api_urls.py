from django.urls import path

from .api_views import *

app_name = 'booking'

urlpatterns = [
    path('service/<int:pk>/availabilites',
         ListCreateAvailaibilites.as_view(), name='list-create-availabilities')
]
