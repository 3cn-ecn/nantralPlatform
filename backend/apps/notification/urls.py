from django.urls import path

from .views import *


app_name = 'notification'

urlpatterns = [
    path('settings/', SettingsView.as_view(), name='settings')
]
