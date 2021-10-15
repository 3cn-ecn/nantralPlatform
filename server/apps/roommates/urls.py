from django.conf.urls import url
from django.urls import path

from .views import *
from apps.group.urls import makeGroupUrlpatterns
from apps.group.views import UpdateGroupView

app_name = 'roommates'

urlpatterns = [
    path('create/housing', CreateHousingView.as_view(), name='create-housing'),
    path('create/<int:housing_pk>/roommates', CreateRoommatesView.as_view(), name='create-roommates'),
    path('map', HousingMap.as_view(), name='housing-map'),
    path('liste', HousingList.as_view(), name='housing-list'),
    path('', HousingList.as_view(), name='index'),
    path('coloc/<slug:slug>/edit/colocathlon', ColocathlonFormView.as_view(), name='colocathlon-edit'),
] + makeGroupUrlpatterns(
            url_base='coloc',
            detail_view=DetailRoommatesView.as_view(),
            update_view=UpdateRoommatesView.as_view(),
        )
