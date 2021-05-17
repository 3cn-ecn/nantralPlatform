from django.conf.urls import url
from django.urls import path

from .views import *

app_name = 'roommates'

urlpatterns = [
    path('housing/<int:pk>', HousingDetailView.as_view(), name='housing-detail'),
    path('housing/create', CreateHousingView.as_view(), name='create-new'),
    path('housing/<int:pk>/edit', EditHousingView.as_view(), name='edit-housing'),
    path('housing/', HousingMap.as_view(), name='housing-map')
]
