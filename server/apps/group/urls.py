from django.urls import path

from .views import *
from apps.event.views import UpdateGroupCreateEventView, UpdateGroupArchivedEventsView, UpdateGroupEventsView
from apps.post.views import UpdateGroupCreatePostView, UpdateGroupPostsView

app_name = 'group'

urlpatterns = [
    # vue generale du groupe
    path('<slug:group_slug>/', 
         DetailGroupView.as_view(), name='detail'),
    path('<slug:group_slug>/member/add/',
         AddToGroupView.as_view(), name='add-member'),

    # edition (réservée aux admins)
    path('<slug:group_slug>/edit',
         UpdateGroupView.as_view(), name='update'),
    path('<slug:group_slug>/members/edit',
         UpdateGroupMembersView.as_view(), name='update-members'),
    path('<slug:group_slug>/events/edit',
         UpdateGroupEventsView.as_view(), name='update-events'),
    path('<slug:group_slug>/events/archived',
         UpdateGroupArchivedEventsView.as_view(), name='archived-events'),
    path('<slug:group_slug>/events/create',
         UpdateGroupCreateEventView.as_view(), name='create-event'),
    path('<slug:group_slug>/posts/create',
         UpdateGroupCreatePostView.as_view(), name='create-post'),
    path('<slug:group_slug>/posts/edit',
         UpdateGroupPostsView.as_view(), name='update-posts'),
    
    # formulaire de demande d'admin
    path('<slug:group_slug>/admin-request/',
         RequestAdminRightsView.as_view(), name='admin-req'),
    path('<slug:group_slug>/admin-request/<int:id>/accept',
         AcceptAdminRequestView.as_view(), name='accept-admin-req'),
    path('<slug:group_slug>/admin-request/<int:id>/deny',
         DenyAdminRequestView.as_view(), name='deny-admin-req')
]
