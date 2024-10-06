from typing import TYPE_CHECKING

from rest_framework import permissions
from rest_framework.request import HttpRequest

from apps.group.models import Group

from .models import SocialLink

if TYPE_CHECKING:
    from apps.student.models import Student


class GroupSocialLinkPermission(permissions.BasePermission):
    def has_permission(self, request: HttpRequest, view):
        user = request.user
        if request.method == "get":
            return True

        group = Group.objects.filter(slug=request.data.get("group")).first()
        return user.is_superuser or (group and group.is_admin(request.user))

    def has_object_permission(
        self, request: HttpRequest, view, obj: SocialLink
    ):
        return any(g.is_admin(request.user) for g in obj.group_set.all())


class UserSocialLinkPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj: SocialLink):
        student: Student = request.user.student
        return student.social_links.contains(obj)
