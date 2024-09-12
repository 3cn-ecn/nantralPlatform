from typing import TYPE_CHECKING

from rest_framework import permissions
from rest_framework.request import Request

from apps.group.models import Group

from .models import SocialLink

if TYPE_CHECKING:
    from apps.student.models import Student


class GroupSocialLinkPermission(permissions.BasePermission):
    def has_permission(self, request: Request, view):
        user = request.user

        if view.action == "create":
            group_slug = request.data.get("group")
            group = Group.objects.filter(slug=group_slug).first()
            return group is None or group.is_admin(user)

        return True

    def has_object_permission(
        self, request: Request, view, obj: SocialLink
    ):
        if request.method in permissions.SAFE_METHODS:
            return True

        user = request.user
        group_set = obj.group_set.all()  # A social link could be associated with multiple groups in theory (but not in practice)

        return any(group.is_admin(user) for group in group_set)


class UserSocialLinkPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj: SocialLink):
        student: Student = request.user.student
        return student.social_links.contains(obj)
