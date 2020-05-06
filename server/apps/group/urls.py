from django.conf.urls import url
from django.urls import path

from .views import *

app_name = 'group'

urlpatterns = [
    path('<slug:pk>/', DetailClubView.as_view(), name='detail'),
    path('<slug:pk>/edit', UpdateClubView.as_view(), name='update'),
    path('<slug:group_slug>/member/add/<slug:user_id>', add_member, name='add-member'),
    path('<slug:pk>/members/edit', edit_named_memberships, name='editNamedMemberships'),
    path('', ListClubView.as_view(), name='list'),
]