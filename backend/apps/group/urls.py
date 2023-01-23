from django.urls import path

from .views import (
    GroupTypeListView,
    GroupListView,
    GroupDetailView,
    UpdateGroupView,
    UpdateGroupMembershipsView,
    # AddToGroupView,
    # UpdateGroupView,
    # UpdateGroupMembersView,
    # RequestAdminRightsView,
    # AcceptAdminRequestView,
    # DenyAdminRequestView,
    # UpdateGroupSocialLinksView
)
# from apps.event.views import (
#     UpdateGroupCreateEventView,
#     UpdateGroupArchivedEventsView,
#     UpdateGroupEventsView)
# from apps.post.views import UpdateGroupCreatePostView, UpdateGroupPostsView

app_name = 'group'

urlpatterns = [
    # vue generale du groupe
    path('', GroupTypeListView.as_view(), name='index'),
    path('<slug:type>/', GroupListView.as_view(), name='sub_index'),
    path('@<slug:slug>', GroupDetailView.as_view(), name='detail'),

    # edition (réservée aux admins)
    path('@<slug:slug>/edit/', UpdateGroupView.as_view(), name='update'),
    path('@<slug:slug>/edit/members/',
         UpdateGroupMembershipsView.as_view(), name='update-members'),
    path('@<slug:slug>/edit/socialnetworks/',
            UpdateGroupView.as_view(), name='update-sociallinks'),
    path('@<slug:slug>/edit/events/',
            UpdateGroupView.as_view(), name='update-events'),
#     path('@<slug:slug>/edit/events/create/',
#             create_event_view, name='create-event'),
#     path('@<slug:slug>/edit/events/archives/',
#             archived_events_view, name='archived-events'),
    path('@<slug:slug>/edit/posts/',
            UpdateGroupView.as_view(), name='update-posts'),
#     path('@<slug:slug>/edit/posts/create/',
#             create_post_view, name='create-post'),

    # # formulaire de demande d'admin
    # path('@<slug:slug>/admin-request/',
    #         RequestAdminRightsView.as_view(), name='admin-req'),
    # path('@<slug:slug>/admin-request/<int:id>/accept/',
    #         AcceptAdminRequestView.as_view(), name='accept-admin-req'),
    # path('@<slug:slug>/admin-request/<int:id>/deny/',
    #         DenyAdminRequestView.as_view(), name='deny-admin-req')
]
