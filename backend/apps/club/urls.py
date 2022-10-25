from django.urls import path

from .views import ListClubView, DetailClubView, DetailGroupMembersView
from apps.group.urls import make_group_url_patterns


app_name = 'club'

urlpatterns = [
    path('', ListClubView.as_view(), name='index'),
    path('liste/', ListClubView.as_view(), name='club-list'),
    path(
        '<slug:slug>/members/',
        DetailGroupMembersView.as_view(),
        name='members'),
] + make_group_url_patterns(
    detail_view=DetailClubView.as_view()
)
