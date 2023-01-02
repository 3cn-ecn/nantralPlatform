from django.urls import path

from .views import (
    DetailGroupView,
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
    path('', DetailGroupView.as_view(), name='index'),
    path('<slug:slug>/', DetailGroupView.as_view(), name='type_index'),
    path('g/<slug:slug>/', DetailGroupView.as_view(), name='detail'),
    path('g/<slug:slug>/update', DetailGroupView.as_view(), name='update'),
    path(
        'g/<slug:slug>/members/add/',
        DetailGroupView.as_view(),
        name='add-member'),

    # # edition (réservée aux admins)
    # path(url_base + '<slug:slug>/edit/',
    #         update_view, name='update'),
    # path(url_base + '<slug:slug>/edit/members/',
    #         update_members_view, name='update-members'),
    # path(url_base + '<slug:slug>/edit/socialnetworks/',
    #         update_sociallinks_view, name='update-sociallinks'),
    # path(url_base + '<slug:slug>/edit/events/',
    #         update_events_view, name='update-events'),
    # path(url_base + '<slug:slug>/edit/events/create/',
    #         create_event_view, name='create-event'),
    # path(url_base + '<slug:slug>/edit/events/archives/',
    #         archived_events_view, name='archived-events'),
    # path(url_base + '<slug:slug>/edit/posts/',
    #         update_posts_view, name='update-posts'),
    # path(url_base + '<slug:slug>/edit/posts/create/',
    #         create_post_view, name='create-post'),

    # # formulaire de demande d'admin
    # path(url_base + '<slug:slug>/admin-request/',
    #         RequestAdminRightsView.as_view(), name='admin-req'),
    # path(url_base + '<slug:slug>/admin-request/<int:id>/accept/',
    #         AcceptAdminRequestView.as_view(), name='accept-admin-req'),
    # path(url_base + '<slug:slug>/admin-request/<int:id>/deny/',
    #         DenyAdminRequestView.as_view(), name='deny-admin-req')
]
