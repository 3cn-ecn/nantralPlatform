from django.contrib.auth.mixins import UserPassesTestMixin
from django.urls import resolve

from apps.utils.slug import *

class UserIsAdmin(UserPassesTestMixin):
    def test_func(self):
        if self.request.user.is_authenticated:
            app = resolve(self.request.path).app_name
            slug = self.kwargs['slug']
            group = get_object_from_slug(app, slug)
            return group.is_admin(self.request.user)
        return False
