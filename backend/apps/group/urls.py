from django.urls import path

from .views import (
    ListGroupTypeView,
    ListGroupView,
    DetailGroupView,
    ListGroupChildrenView,
    DeleteGroupView,
    CreateGroupView,
    UpdateGroupView,
    UpdateGroupMembershipsView,
    UpdateGroupSocialLinksView,
    UpdateGroupChildrenView,
    UpdateGroupEventsView,
    UpdateGroupPostsView,
    UpdateSubscriptionView,
    MembershipFormView,
    AdminRequestFormView,
    AcceptAdminRequestView,
    DenyAdminRequestView
)

app_name = 'group'

urlpatterns = [
    # list views
    path('', ListGroupTypeView.as_view(), name='index'),
    path('<slug:type>/', ListGroupView.as_view(), name='sub_index'),
    path('<slug:type>/create/', CreateGroupView.as_view(), name='create'),

    # objet views (for group admins only)
    path('@<slug:slug>/', DetailGroupView.as_view(), name='detail'),
    path('@<slug:slug>/children',
         ListGroupChildrenView.as_view(), name='children'),
    path('@<slug:slug>/edit/', UpdateGroupView.as_view(), name='update'),
    path('@<slug:slug>/edit/members/',
         UpdateGroupMembershipsView.as_view(), name='update-members'),
    path('@<slug:slug>/edit/social_links/',
         UpdateGroupSocialLinksView.as_view(), name='update-sociallinks'),
    path('@<slug:slug>/edit/events/',
         UpdateGroupEventsView.as_view(), name='update-events'),
    path('@<slug:slug>/edit/children/',
         UpdateGroupChildrenView.as_view(), name='update-children'),
    path('@<slug:slug>/edit/posts/',
         UpdateGroupPostsView.as_view(), name='update-posts'),
    path('@<slug:slug>/edit/delete/',
         DeleteGroupView.as_view(), name='delete'),

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
