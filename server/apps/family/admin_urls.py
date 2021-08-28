from django.urls import path

from .admin_views import *

app_name = 'family-admin'

urlpatterns = [
    path('home', HomeAdminView.as_view(), name='home'),
]