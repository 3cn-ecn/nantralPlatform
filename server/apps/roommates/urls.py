from django.conf.urls import url
from django.urls import path

from .views import *

app_name = 'roommates'

urlpatterns = [
    path('<int:pk>', HousingDetailView.as_view(), name='housing-details'),
    path('create', CreateHousingView.as_view(), name='create-new'),
    path('<int:pk>/edit', EditHousingView.as_view(), name='edit-housing'),
    path('map', HousingMap.as_view(), name='housing-map'),
    path('liste', HousingList.as_view(), name='housing-list'),
    path('', HousingList.as_view()),
]
