from django.conf.urls import url
from django.urls import path

from .views import *

app_name = 'group'

urlpatterns = [
    path('<slug:pk>/', DetailClubView.as_view(), name='detail'),
    path('<slug:pk>/edit', UpdateClubView.as_view(), name='update'),
    path('<slug:group_slug>/member/add/<slug:user_id>', add_member, name='add-member'),
    path('', ListClubView.as_view(), name='list'),
    path('<slug:group_slug>/events/edit', UpdateGroupEventsView.as_view(), name='update-events'),
    path('<slug:group_slug>/members/edit', UpdateGroupMembersView.as_view(), name='update-members')
]