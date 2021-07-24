from django.urls import path

from .views import *
from apps.event.views import UpdateGroupCreateEventView, UpdateGroupArchivedEventsView, UpdateGroupEventsView
from apps.post.views import UpdateGroupCreatePostView, UpdateGroupPostsView
from apps.booking.views import CreateServiceView, UpdateGroupListServicesView

app_name = 'group'

# note : les vues de l'app groupe servent uniquement de modèle
# pour celles des autres modèles de groupe
# pour créer un nouveau groupe, utilisez
# urlpatterns = makeGroupUrlpatterns("nom_du_groupe_dans_slug")


def makeGroupUrlpatterns(group_name):
    args = {'group_type': group_name}
    urlpatterns = [
        # vue generale du groupe
        path('<slug:mini_slug>/',
             DetailGroupView.as_view(), args, name='detail'),
        path('<slug:mini_slug>/events/',
             UpdateGroupArchivedEventsView.as_view(), args, name='archived-events'),

        # edition (réservée aux admins)
        path('<slug:mini_slug>/member/add/',
             AddToGroupView.as_view(), args, name='add-member'),
        path('<slug:mini_slug>/edit/',
             UpdateGroupView.as_view(), args, name='update'),
        path('<slug:mini_slug>/edit/members/',
             UpdateGroupMembersView.as_view(), args, name='update-members'),
        path('<slug:mini_slug>/edit/events/',
             UpdateGroupEventsView.as_view(), args, name='update-events'),
        path('<slug:mini_slug>/edit/events/create/',
             UpdateGroupCreateEventView.as_view(), args, name='create-event'),
        path('<slug:mini_slug>/edit/posts/',
             UpdateGroupPostsView.as_view(), args, name='update-posts'),
        path('<slug:mini_slug>/edit/posts/create/',
             UpdateGroupCreatePostView.as_view(), args, name='create-post'),

        # formulaire de demande d'admin
        path('<slug:mini_slug>/admin-request/',
             RequestAdminRightsView.as_view(), args, name='admin-req'),
        path('<slug:mini_slug>/admin-request/<int:id>/accept',
             AcceptAdminRequestView.as_view(), args, name='accept-admin-req'),
        path('<slug:mini_slug>/admin-request/<int:id>/deny',
             DenyAdminRequestView.as_view(), args, name='deny-admin-req'),
        path('<slug:mini_slug>/edit/service/create/',
             CreateServiceView.as_view(), name='create-service'),
        path('<slug:mini_slug>/edit/service/',
             UpdateGroupListServicesView.as_view(), name='update-services')
    ]
    return urlpatterns
