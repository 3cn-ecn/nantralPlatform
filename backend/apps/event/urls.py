from django.urls import path

from .views import (
    EventUpdateView,
    EventCreateView,
    EventDeleteView,
    add_participant,
    remove_participant)

app_name = 'event'

urlpatterns = [
    path('create/group/<slug:group>/',
         EventCreateView.as_view(), name='create'),
    path('<slug:pk>/edit/', EventUpdateView.as_view(), name='edit'),
    path('<slug:slug>/delete/', EventDeleteView.as_view(), name='delete'),
    path('<slug:slug>/participants/add/',
         add_participant, name='add-participant'),
    path('<slug:slug>/participants/delete/',
         remove_participant, name='remove-participant')
]
