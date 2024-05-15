# ruff: noqa: B008

from django.urls import path

from .views import (
    AcceptAdminRequestView,
    AddToGroupView,
    DenyAdminRequestView,
    DetailGroupView,
    RequestAdminRightsView,
    UpdateGroupMembersView,
    UpdateGroupSocialLinksView,
    UpdateGroupView,
)

app_name = "group"


def make_group_url_patterns(  # noqa: PLR0913
    url_base="",
    detail_view=DetailGroupView.as_view(),
    add_member_view=AddToGroupView.as_view(),
    update_view=UpdateGroupView.as_view(),
    update_members_view=UpdateGroupMembersView.as_view(),
    update_sociallinks_view=UpdateGroupSocialLinksView.as_view(),
    update_events_view=UpdateGroupView.as_view(),
    create_event_view=UpdateGroupView.as_view(),
    archived_events_view=UpdateGroupView.as_view(),
):
    """
    Fonction créant toutes les urls pour un groupe
    (ex: clubs, listes, colocs, cours...).
        ->  url_base est l'url qui peut être ajoutée
            devant les slugs, sans aucun slash
        ->  *_view permet de remplacer la vue générale de
            group par une vue personnalisée pour le groupe
    """

    if url_base:
        url_base += "/"

    urlpatterns = [
        # vue generale du groupe
        path(url_base + "<slug:slug>/", detail_view, name="detail"),
        path(
            url_base + "<slug:slug>/members/add/",
            add_member_view,
            name="add-member",
        ),
        # edition (réservée aux admins)
        path(url_base + "<slug:slug>/edit/", update_view, name="update"),
        path(
            url_base + "<slug:slug>/edit/members/",
            update_members_view,
            name="update-members",
        ),
        path(
            url_base + "<slug:slug>/edit/socialnetworks/",
            update_sociallinks_view,
            name="update-sociallinks",
        ),
        path(
            url_base + "<slug:slug>/edit/events/",
            update_events_view,
            name="update-events",
        ),
        path(
            url_base + "<slug:slug>/edit/events/create/",
            create_event_view,
            name="create-event",
        ),
        path(
            url_base + "<slug:slug>/edit/events/archives/",
            archived_events_view,
            name="archived-events",
        ),
        # formulaire de demande d'admin
        path(
            url_base + "<slug:slug>/admin-request/",
            RequestAdminRightsView.as_view(),
            name="admin-req",
        ),
        path(
            url_base + "<slug:slug>/admin-request/<int:id>/accept/",
            AcceptAdminRequestView.as_view(),
            name="accept-admin-req",
        ),
        path(
            url_base + "<slug:slug>/admin-request/<int:id>/deny/",
            DenyAdminRequestView.as_view(),
            name="deny-admin-req",
        ),
    ]
    return urlpatterns
