from rest_framework import permissions

from apps.account.models import Email, User


class CanEditProfileOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if isinstance(obj, User):
            return request.user is not None and (
                request.user == obj or request.user.is_superuser
            )
        if isinstance(obj, Email):
            return request.user is not None and (
                request.user == obj.user or request.user.is_superuser
            )
        return False
