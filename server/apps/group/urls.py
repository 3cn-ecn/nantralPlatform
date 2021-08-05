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
        group_type, 
        url_base='',
        detail_view = DetailGroupView.as_view(),
        add_member_view = AddToGroupView.as_view(),
        update_view = UpdateGroupView.as_view(),
        update_members_view = UpdateGroupMembersView.as_view(),
        update_sociallinks_view = UpdateGroupSocialLinksView.as_view(),
        update_events_view = UpdateGroupEventsView.as_view(),
        create_event_view = UpdateGroupCreateEventView.as_view(),
        archived_events_view = UpdateGroupArchivedEventsView.as_view(),
        update_posts_view = UpdateGroupPostsView.as_view(), 
        create_post_view = UpdateGroupCreatePostView.as_view(),
        ):
    
    '''
    Fonction créant toutes les urls pour un groupe 
    (ex: clubs, listes, colocs, cours...).
        ->  group_type est la première partie du slug, 
            correspondant au type
        ->  url_base est l'url qui peut être ajoutée 
            devant les slugs
        ->  *_view permet de remplacer la vue générale de 
            group par une vue personnalisée pour le groupe 
    '''
    
    args = {}

    urlpatterns = [
        # vue generale du groupe
        path(url_base+'<slug:mini_slug>/', 
            detail_view, args, name='detail'),
        path(url_base+'<slug:mini_slug>/members/add/', 
            add_member_view, args, name='add-member'),

        # edition (réservée aux admins)
        path(url_base+'<slug:mini_slug>/edit/', 
            update_view, args, name='update'),
        path(url_base+'<slug:mini_slug>/edit/members/', 
            update_members_view, args, name='update-members'),
        path(url_base+'<slug:mini_slug>/edit/socialnetworks/', 
            update_sociallinks_view, args, name='update-sociallinks'),
        path(url_base+'<slug:mini_slug>/edit/events/', 
            update_events_view, args, name='update-events'),
        path(url_base+'<slug:mini_slug>/edit/events/create/', 
            create_event_view, args, name='create-event'),
        path(url_base+'<slug:mini_slug>/edit/events/archives/', 
            archived_events_view, args, name='archived-events'),
        path(url_base+'<slug:mini_slug>/edit/posts/', 
            update_posts_view, args, name='update-posts'),
        path(url_base+'<slug:mini_slug>/edit/posts/create/', 
            create_post_view, args, name='create-post'),
        
        # formulaire de demande d'admin
        path(url_base+'<slug:mini_slug>/admin-request/',
            RequestAdminRightsView.as_view(), args, name='admin-req'),
        path(url_base+'<slug:mini_slug>/admin-request/<int:id>/accept',
            AcceptAdminRequestView.as_view(), args, name='accept-admin-req'),
        path(url_base+'<slug:mini_slug>/admin-request/<int:id>/deny',
            DenyAdminRequestView.as_view(), args, name='deny-admin-req')
    ]
    return urlpatterns

