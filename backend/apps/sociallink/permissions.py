from rest_framework import permissions
from rest_framework.request import HttpRequest

from apps.group.models import Group

from .models import SocialLink


class SocialLinkPermission(permissions.BasePermission):
    def has_permission(self, request: HttpRequest, view):
        user = request.user

        if view.action == "create":
            group_slug = request.data.get("group")
            group = Group.objects.filter(slug=group_slug).first()
            return group is None or group.is_admin(user)

        return True

    def has_object_permission(
        self, request: HttpRequest, view, obj: SocialLink
    ):
        return any(g.is_admin(request.user) for g in obj.group_set.all())
