from django.utils.translation import gettext_lazy as _

from rest_framework import exceptions, permissions

from .models import Group, GroupType, Membership


class GroupPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if view.action == "create":
            group_type = GroupType.objects.filter(
                slug=request.query_params.get("type", None)
            ).first()
            if not group_type:
                raise exceptions.ValidationError(
                    _(
                        "You must specify a valid group type\
                        in query parameters."
                    )
                )
            user = request.user
            return user.is_authenticated and (
                group_type.can_create or user.is_superuser
            )
        return True

    def has_object_permission(self, request, view, obj: Group):
        user = request.user
        if view.action == "admin_request":
            return obj.membership_set.filter(
                student__user=request.user
            ).exists()
        if request.method in permissions.SAFE_METHODS:
            if obj.public:
                return True
            if obj.private:
                return obj.is_member(user) or user.is_superuser
            return user.is_authenticated
        return obj.is_admin(request.user)


class MembershipPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj: Membership):
        if request.method in permissions.SAFE_METHODS:
            return not obj.group.private or obj.group.is_member(request.user)
        return obj.student.user == request.user or obj.group.is_admin(
            request.user
        )


class AdminRequestPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        slug = view.kwargs.get("slug")
        try:
            group = Group.objects.get(slug=slug)
        except Group.DoesNotExist:
            return True
        return group.is_admin(user)
