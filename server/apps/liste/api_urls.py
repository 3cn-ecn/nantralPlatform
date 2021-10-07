from django.urls import path

from .api_views import *

app_name = 'liste'

urlpatterns = [
    path('list-members', ListListeMembersAPIView.as_view(),
         name='list-liste-members'),
]
