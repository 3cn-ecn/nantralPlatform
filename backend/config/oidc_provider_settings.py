from django.utils.translation import gettext_lazy as _

from oidc_provider.lib.claims import ScopeClaims

from apps.account.models import User


class CustomScopeClaims(ScopeClaims):
    """Adds a scope claim used to provide info for matrix"""

    info_mas = (
        _("Profile"),
        _("Information concerning yourself such as your username and name."),
    )

    def scope_mas(self):
        dic = {
            "sub": str(self.user.id),
            "preferred_username": self.user.username,
            "name": self.user.name,
            "picture": self.user.picture.url if self.user.picture else None,
        }

        return dic

    info_groups = (
        _("Groups"),
        _(
            "Information about the groups you belong to, used for access control in some applications."
        ),
    )

    def scope_groups(self):
        dic = {
            "groups": [group.name for group in self.user.groups.all()],
        }

        return dic


def userinfo(claims, user: User):
    # Populate claims dict.
    claims["name"] = user.name
    claims["username"] = user.username
    claims["email"] = user.email.email
    claims["email_verified"] = user.email.is_valid

    return claims
