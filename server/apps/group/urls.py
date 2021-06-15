from django.urls import path

from .views import *
from apps.event.views import UpdateGroupCreateEventView, UpdateGroupArchivedEventsView, UpdateGroupEventsView
from apps.post.views import UpdateGroupCreatePostView, UpdateGroupPostsView

app_name = 'group'

urlpatterns = [
    path('group/<slug:group_slug>/', DetailGroupView.as_view(), name='detail'),
    path('group/<slug:group_slug>/edit',
         UpdateGroupView.as_view(), name='update'),
    path('group/<slug:slug>/member/add/',
         AddToGroupView.as_view(), name='add-member'),
    # path('club/', ListClubView.as_view(), name='club-list'),
    path('club/<slug:group_slug>/events/edit',
         UpdateGroupEventsView.as_view(), name='update-events'),
    path('club/<slug:group_slug>/events/archived',
         UpdateGroupArchivedEventsView.as_view(), name='archived-events'),
    path('club/<slug:group_slug>/events/create',
         UpdateGroupCreateEventView.as_view(), name='create-event'),
    path('club/<slug:group_slug>/posts/create',
         UpdateGroupCreatePostView.as_view(), name='create-post'),
    path('club/<slug:group_slug>/posts/edit',
         UpdateGroupPostsView.as_view(), name='update-posts'),
    path('club/<slug:group_slug>/members/edit',
         UpdateGroupMembersView.as_view(), name='update-members'),
    # path('liste/', ListeListView.as_view(), name='liste-list'),
    path('group/<slug:group_slug>/admin-request/',
         RequestAdminRightsView.as_view(), name='admin-req'),
    path('group/<slug:group_slug>/admin-request/<int:id>/accept',
         AcceptAdminRequestView.as_view(), name='accept-admin-req'),
    path('group/<slug:group_slug>/admin-request/<int:id>/deny',
         DenyAdminRequestView.as_view(), name='deny-admin-req')
]
