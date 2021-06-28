from django.urls import path

from .views import *
from apps.event.views import UpdateGroupCreateEventView, UpdateGroupArchivedEventsView, UpdateGroupEventsView
from apps.post.views import UpdateGroupCreatePostView, UpdateGroupPostsView

app_name = 'group'

# note : les vues de l'app groupe servent uniquement de modèle
# pour celles des autres modèles de groupe
# pour créer un nouveau groupe, utilisez
# urlpatterns = makeGroupUrlpatterns("nom_du_groupe_dans_slug")

def makeGroupUrlpatterns(group_name = None):
    group = {'group_type': group_name}
    urlpatterns = [
        # vue generale du groupe
        path('<slug:group_slug>/', 
            DetailGroupView.as_view(), group, name='detail'),
        path('<slug:group_slug>/events/',
            UpdateGroupArchivedEventsView.as_view(), group, name='archived-events'),

        # edition (réservée aux admins)
        path('<slug:group_slug>/member/add/',
            AddToGroupView.as_view(), group, name='add-member'),
        path('<slug:group_slug>/edit/',
            UpdateGroupView.as_view(), group, name='update'),
        path('<slug:group_slug>/edit/members/',
            UpdateGroupMembersView.as_view(), group, name='update-members'),
        path('<slug:group_slug>/edit/events/',
            UpdateGroupEventsView.as_view(), group, name='update-events'),
        path('<slug:group_slug>/edit/events/create/',
            UpdateGroupCreateEventView.as_view(), group, name='create-event'),
        path('<slug:group_slug>/edit/posts/',
            UpdateGroupPostsView.as_view(), group, name='update-posts'),
        path('<slug:group_slug>/edit/posts/create/',
            UpdateGroupCreatePostView.as_view(), group, name='create-post'),
        
        # formulaire de demande d'admin
        path('<slug:group_slug>/admin-request/',
            RequestAdminRightsView.as_view(), group, name='admin-req'),
        path('<slug:group_slug>/admin-request/<int:id>/accept',
            AcceptAdminRequestView.as_view(), group, name='accept-admin-req'),
        path('<slug:group_slug>/admin-request/<int:id>/deny',
            DenyAdminRequestView.as_view(), group, name='deny-admin-req')
    ]
    return urlpatterns


urlpatterns = makeGroupUrlpatterns()