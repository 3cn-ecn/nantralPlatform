from django.conf.urls import url
from django.urls import path

from .views import *

app_name = 'event'

urlpatterns = [
    path('event/<slug:event_slug>/', EventDetailView.as_view(), name='detail'),
]