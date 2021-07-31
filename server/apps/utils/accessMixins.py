from django.contrib.auth.decorators import login_required
from django.db import models
from django.utils.decorators import method_decorator
from django.contrib.auth.mixins import UserPassesTestMixin
from django.views.generic.detail import DetailView
from django.contrib.auth.models import User

from apps.group.models import Group


class OwnedObject(models.Model):
    """Abstract object to know if someone has rights over an object."""
    group = models.SlugField()

    class Meta:
        abstract = True

    def can_edit(self, user: User) -> bool:
        group = Group.get_group_by_slug(self.group)
        return group.is_admin(user)


class LoginRequiredAccessMixin(object):

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(LoginRequiredAccessMixin, self).dispatch(request, *args, **kwargs)


class UserIsAdmin(UserPassesTestMixin):
    def test_func(self):
        if self.request.user.is_authenticated:
            group = Group.get_group_by_slug(self.get_slug)
            return group.is_admin(self.request.user)
        return False


class UserEditRightsObjectView(UserPassesTestMixin, DetailView):
    """Access Control Mixin to check wether a user has edit rights over an object owned by a group."""
    model = OwnedObject

    def test_func(self) -> bool:
        if self.request.user.is_authenticated:
            return self.get_object().can_edit(self.request.user)
        return False
