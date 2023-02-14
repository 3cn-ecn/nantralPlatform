from django.urls import path

from .views import (
    GroupTypeListView,
    GroupListView,
    GroupDetailView,
    UpdateGroupView,
    UpdateGroupMembershipsView,
    UpdateGroupSocialLinksView,
    UpdateGroupEventsView,
    UpdateGroupPostsView,
    UpdateSubscriptionView,
    MembershipFormView,
    AdminRequestFormView,
    AcceptAdminRequestView,
    DenyAdminRequestView
)
# from apps.event.views import (
#     UpdateGroupCreateEventView,
#     UpdateGroupArchivedEventsView,
#     UpdateGroupEventsView)
# from apps.post.views import UpdateGroupCreatePostView, UpdateGroupPostsView

app_name = 'group'

urlpatterns = [
    # main views
    path('', GroupTypeListView.as_view(), name='index'),
    path('<slug:type>/', GroupListView.as_view(), name='sub_index'),
    path('@<slug:slug>/', GroupDetailView.as_view(), name='detail'),

    # edit views (for group admins only)
    path('@<slug:slug>/edit/', UpdateGroupView.as_view(), name='update'),
    path('@<slug:slug>/edit/members/',
         UpdateGroupMembershipsView.as_view(), name='update-members'),
    path('@<slug:slug>/edit/social_links/',
         UpdateGroupSocialLinksView.as_view(), name='update-sociallinks'),
    path('@<slug:slug>/edit/events/',
         UpdateGroupEventsView.as_view(), name='update-events'),
    path('@<slug:slug>/edit/posts/',
         UpdateGroupPostsView.as_view(), name='update-posts'),

    # views for django forms
    path('@<slug:slug>/edit-subscription/',
         UpdateSubscriptionView.as_view(), name='edit-subscription'),
    path('@<slug:slug>/edit-membership/',
         MembershipFormView.as_view(), name='edit-member'),

    # views for admin request
    path('@<slug:slug>/admin-request/',
         AdminRequestFormView.as_view(), name='admin-request'),
    path('admin-request/<int:id>/accept/',
         AcceptAdminRequestView.as_view(), name='accept-admin-req'),
    path('admin-request/<int:id>/deny/',
         DenyAdminRequestView.as_view(), name='deny-admin-req')
]
