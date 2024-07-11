from django.contrib import messages
from django.contrib.auth.mixins import UserPassesTestMixin
from django.http import HttpRequest
from django.shortcuts import get_object_or_404, redirect
from django.utils.translation import gettext as _
from django.views.generic import (
    View,
)

from .models import Group, Membership


class UserIsGroupAdminMixin(UserPassesTestMixin):
    """A mixin class to test if a user has the rights to see a group."""

    def test_func(self) -> bool:
        try:
            group = Group.objects.get(slug=self.kwargs.get("slug"))
            user = self.request.user
            return group.is_admin(user)
        except Group.DoesNotExist:
            return self.request.user.is_superuser


class AcceptAdminRequestView(UserIsGroupAdminMixin, View):
    def get(self, request: HttpRequest, id):  # noqa: A002
        member = get_object_or_404(Membership, id=id)
        if member.admin_request:
            member.accept_admin_request()
            messages.success(
                request,
                message=(
                    _("The user %(user)s is now admin!")
                    % {"user": member.student}
                ),
            )
        else:
            messages.error(request, message=_("Request already answered!"))
        return redirect(member.group.get_absolute_url())


class DenyAdminRequestView(UserIsGroupAdminMixin, View):
    def get(self, request: HttpRequest, id):  # noqa: A002
        member = get_object_or_404(Membership, id=id)
        if member.admin_request:
            member.deny_admin_request()
            messages.success(
                request,
                message=(
                    _("The admin request from %(user)s has been denied.")
                    % {"user": member.student}
                ),
            )
        else:
            messages.error(request, message=_("Request already answered!"))
        return redirect(member.group.get_absolute_url())
