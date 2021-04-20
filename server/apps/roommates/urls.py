from django.conf.urls import url
from django.urls import path

from .views import *

app_name = 'roommates'

urlpatterns = [
    path('housing/', HousingMap.as_view(), name='housing-map')
]