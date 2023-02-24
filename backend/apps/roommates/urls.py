from django.urls import path

from .views import (
    CreateHousingView,
    CreateRoommatesView,
    HousingMap,
    HousingList,
    ColocathlonFormView,
    DetailRoommatesView,
    UpdateRoommatesView)
from apps.group.abstract.urls import make_group_url_patterns

app_name = 'roommates'

urlpatterns = [
    path('create/housing/', CreateHousingView.as_view(), name='create-housing'),
    path('create/<int:housing_pk>/roommates/',
         CreateRoommatesView.as_view(), name='create-roommates'),
    path('map/', HousingMap.as_view(), name='housing-map'),
    path('liste/', HousingList.as_view(), name='housing-list'),
    path('', HousingMap.as_view(), name='index'),
    path('coloc/<slug:slug>/edit/colocathlon/',
         ColocathlonFormView.as_view(), name='colocathlon-edit'),
] + make_group_url_patterns(
    url_base='coloc',
    detail_view=DetailRoommatesView.as_view(),
    update_view=UpdateRoommatesView.as_view(),
)
