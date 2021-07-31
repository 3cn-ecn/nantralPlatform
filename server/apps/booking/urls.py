from django.urls import path

from .views import *

app_name = 'booking'

urlpatterns = [
    path('service/<int:pk>/edit', UpdateServiceView.as_view(), name='service-edit'),
    path('service/<int:pk>/availabilities/edit',
         AvailabiltiesEditView.as_view(), name='availabilities-edit'),
    path('service/<int:pk>/availabilites',
         AvailabilitiesListView.as_view(), name='service-availabilities'),
    path('service/<int:pk>/', ServiceDetailView.as_view(), name='service-detail'),
]
