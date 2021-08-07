from django.db import models
from django.urls import resolve

from django.contrib.auth.mixins import UserPassesTestMixin
from django.views.generic.detail import DetailView
from django.contrib.auth.models import User

from apps.group.models import Group
from apps.utils.slug import get_object_from_slug


class OwnedObject(models.Model):
    """Abstract object to know if someone has rights over an object."""
    group = models.SlugField()

    class Meta:
        abstract = True

    def can_edit(self, user: User) -> bool:
        group = Group.get_group_by_slug(self.group)
        return group.is_admin(user)


class UserIsAdmin(UserPassesTestMixin):
    def test_func(self):
        if self.request.user.is_authenticated:
            app = resolve(self.request.path).app_name
            slug = self.kwargs['slug']
            group = get_object_from_slug(app, slug)
            return group.is_admin(self.request.user)
        return False


class UserEditRightsObjectView(UserPassesTestMixin, DetailView):
    """Access Control Mixin to check wether a user has edit rights over an object owned by a group."""
    model = OwnedObject

    def test_func(self) -> bool:
        if self.request.user.is_authenticated:
            return self.get_object().can_edit(self.request.user)


class UserIsSuperAdmin(UserPassesTestMixin):
    def test_func(self):
        if self.request.user.is_authenticated:
            return self.request.user.is_superuser
        return False
