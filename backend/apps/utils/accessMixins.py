from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import UserPassesTestMixin
from django.urls import resolve
from django.contrib.auth import get_user_model

from apps.utils.slug import get_object_from_slug

User = get_user_model()


def user_is_connected(user: User) -> bool:
    """Test if a user is connected and have a Student object.

    Parameters
    ----------
    user : User
        The user to test

    Returns
    -------
    bool
        True if user is connected and have a student object.
    """
    return (
        not (user.is_anonymous)
        and user.is_authenticated
        and hasattr(user, "student")
    )


class UserIsMember(UserPassesTestMixin):
    """Check if a user is a member, for a group page"""

    def test_func(self) -> bool:
        if user_is_connected(self.request.user):
            app = resolve(self.request.path).app_name
            slug = self.kwargs["slug"]
            group = get_object_from_slug(app, slug)
            return group.is_member(self.request.user)
        return False


class UserIsAdmin(UserPassesTestMixin):
    """Check if a user is an admin, for a group page"""

    def test_func(self) -> bool:
        if user_is_connected(self.request.user):
            app = resolve(self.request.path).app_name
            slug = self.kwargs["slug"]
            group = get_object_from_slug(app, slug)
            return group.is_admin(self.request.user)
        return False


class UserIsSuperAdmin(UserPassesTestMixin):
    """Check if a user is a super admin, for a group page"""

    def test_func(self) -> bool:
        if user_is_connected(self.request.user):
            return self.request.user.is_superuser
        return False


class UserIsInGroup(UserPassesTestMixin):
    """Check if a user is in a group, declared in self.group"""

    def test_func(self) -> bool:
        if user_is_connected(self.request.user):
            if self.request.user.is_superuser:
                return True
            return self.request.user.groups.filter(name=self.group).exists()
        return False
