from django.contrib.auth.mixins import UserPassesTestMixin
from django.urls import resolve

from apps.utils.slug import *


class UserIsAdmin(UserPassesTestMixin):
    """Check if a user is an admin, for a group page"""
    def test_func(self):
        if self.request.user.is_authenticated:
            app = resolve(self.request.path).app_name
            slug = self.kwargs['slug']
            group = get_object_from_slug(app, slug)
            return group.is_admin(self.request.user)
        return False


class UserIsSuperAdmin(UserPassesTestMixin):
    def test_func(self):
        if self.request.user.is_authenticated:
            return self.request.user.is_superuser
        return False



class UserIsFamilyAdmin(UserPassesTestMixin):
    def test_func(self):
        if self.request.user.is_authenticated:
            return self.request.user.groups.filter(name = "admin-family").exists()
        return False
