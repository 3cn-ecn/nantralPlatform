from django.urls import path

from .views import DetailGroupView, AddToGroupView, UpdateGroupView, UpdateGroupMembersView, RequestAdminRightsView, AcceptAdminRequestView, DenyAdminRequestView, UpdateGroupSocialLinksView
from apps.event.views import UpdateGroupCreateEventView, UpdateGroupArchivedEventsView, UpdateGroupEventsView
from apps.post.views import UpdateGroupCreatePostView, UpdateGroupPostsView

app_name = 'group'

# note : les vues de l'app groupe servent uniquement de modèle
# pour celles des autres modèles de groupe
# pour créer un nouveau groupe, utilisez
# urlpatterns = makeGroupUrlpatterns("nom_du_groupe_dans_slug")


def makeGroupUrlpatterns(
        url_base='',
        detail_view=DetailGroupView.as_view(),
        add_member_view=AddToGroupView.as_view(),
        update_view=UpdateGroupView.as_view(),
        update_members_view=UpdateGroupMembersView.as_view(),
        update_sociallinks_view=UpdateGroupSocialLinksView.as_view(),
        update_events_view=UpdateGroupEventsView.as_view(),
        create_event_view=UpdateGroupCreateEventView.as_view(),
        archived_events_view=UpdateGroupArchivedEventsView.as_view(),
        update_posts_view=UpdateGroupPostsView.as_view(),
        create_post_view=UpdateGroupCreatePostView.as_view(),
):
    '''
    Fonction créant toutes les urls pour un groupe 
    (ex: clubs, listes, colocs, cours...).
        ->  url_base est l'url qui peut être ajoutée 
            devant les slugs
        ->  *_view permet de remplacer la vue générale de 
            group par une vue personnalisée pour le groupe 
    '''

    urlpatterns = [
        # vue generale du groupe
        path(url_base+'<slug:slug>/',
             detail_view, name='detail'),
        path(url_base+'<slug:slug>/members/add/',
             add_member_view, name='add-member'),

        # edition (réservée aux admins)
        path(url_base+'<slug:slug>/edit/',
             update_view, name='update'),
        path(url_base+'<slug:slug>/edit/members/',
             update_members_view, name='update-members'),
        path(url_base+'<slug:slug>/edit/socialnetworks/',
             update_sociallinks_view, name='update-sociallinks'),
        path(url_base+'<slug:slug>/edit/events/',
             update_events_view, name='update-events'),
        path(url_base+'<slug:slug>/edit/events/create/',
             create_event_view, name='create-event'),
        path(url_base+'<slug:slug>/edit/events/archives/',
             archived_events_view, name='archived-events'),
        path(url_base+'<slug:slug>/edit/posts/',
             update_posts_view, name='update-posts'),
        path(url_base+'<slug:slug>/edit/posts/create/',
             create_post_view, name='create-post'),

        # formulaire de demande d'admin
        path(url_base+'<slug:slug>/admin-request/',
             RequestAdminRightsView.as_view(), name='admin-req'),
        path(url_base+'<slug:slug>/admin-request/<int:id>/accept',
             AcceptAdminRequestView.as_view(), name='accept-admin-req'),
        path(url_base+'<slug:slug>/admin-request/<int:id>/deny',
             DenyAdminRequestView.as_view(), name='deny-admin-req')
    ]
    return urlpatterns
