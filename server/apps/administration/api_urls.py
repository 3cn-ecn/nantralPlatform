from django.urls import path

from .api_views import *

app_name = 'administration'

urlpatterns = [
    path('administration-members', ListAdministrationMembersAPIView.as_view(),
         name='list-administration-members'),
]
