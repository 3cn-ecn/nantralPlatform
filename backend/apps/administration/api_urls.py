from django.urls import path

from .api_views import ListAdministrationMembersAPIView

app_name = 'administration'

urlpatterns = [
    path('administration-members', ListAdministrationMembersAPIView.as_view(),
         name='list-members'),
]
