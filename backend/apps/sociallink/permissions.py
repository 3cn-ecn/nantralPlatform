from rest_framework import permissions
from rest_framework.request import HttpRequest

from apps.group.models import Group

from .models import SocialLink


class SocialLinkPermission(permissions.BasePermission):
    def has_permission(self, request: HttpRequest, view):
        group = Group.objects.filter(slug=request.data.get("group")).first()
        if request.method == "post":
            return True
        return group and group.is_admin(request.user)

    def has_object_permission(
        self, request: HttpRequest, view, obj: SocialLink
    ):
        return any(g.is_admin(request.user) for g in obj.group_set.all())
