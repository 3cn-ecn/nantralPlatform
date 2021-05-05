from django.conf.urls import url
from django.urls import path

from .views import *

app_name = 'roommates'

urlpatterns = [
    path('housing/<int:pk>', HousingDetailView.as_view(), name='housing-view'),
    path('housing/', HousingMap.as_view(), name='housing-map'),
]