from django.conf.urls import url
from django.urls import path

from .api_views import *

app_name = 'roommates'

urlpatterns = [
    path('housing/', HousingView.as_view(), name='housing'),
]