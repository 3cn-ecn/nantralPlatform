from django.urls import path

from .views import (
    EventDetailView,
    EventUpdateView,
    add_participant,
    remove_participant)

app_name = 'event'

urlpatterns = [
    path('<slug:slug>/', EventDetailView.as_view(), name='detail'),
    path('<slug:slug>/edit/', EventUpdateView.as_view(), name='edit'),
    path('<slug:slug>/participants/add/',
         add_participant, name='add-participant'),
    path('<slug:slug>/participants/delete/',
         remove_participant, name='remove-participant')
]
