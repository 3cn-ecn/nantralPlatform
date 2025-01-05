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
        user = request.user
        group_set = obj.group_set.all()  # A social link could be associated with multiple groups in theory (but not in practice)

        return any(group.is_admin(user) for group in group_set)
