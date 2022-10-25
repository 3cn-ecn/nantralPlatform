from django.urls import path

from .views import (
    EventUpdateView,
    EventDetailView,
    add_participant,
    remove_participant)

app_name = 'event'

urlpatterns = [
    path('<slug:event_slug>/edit/', EventUpdateView.as_view(), name='edit'),
    path('<slug:event_slug>/', EventDetailView.as_view(), name='detail'),
    path('<slug:event_slug>/participants/add/',
         add_participant, name='add-participant'),
    path('<slug:event_slug>/participants/delete/',
         remove_participant, name='remove-participant')
]
