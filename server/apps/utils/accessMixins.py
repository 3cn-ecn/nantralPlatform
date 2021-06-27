from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.contrib.auth.mixins import UserPassesTestMixin

from apps.group.models import Group

class LoginRequiredAccessMixin(object):

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(LoginRequiredAccessMixin, self).dispatch(request, *args, **kwargs)


class UserIsAdmin(UserPassesTestMixin):
    def test_func(self):
        if self.request.user.is_authenticated:
            group = self.get_object()
            return group.is_admin(self.request.user)
        return False
