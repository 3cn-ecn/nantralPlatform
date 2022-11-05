from django.urls import path

from .admin_views import (HomeAdminView, ResetView)

app_name = 'roommates-admin'

urlpatterns = [
    path('', HomeAdminView.as_view(), name='home'),
    path('reset', ResetView.as_view(), name='reset')
]
