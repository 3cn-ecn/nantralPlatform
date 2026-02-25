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
            "name": self.userinfo["name"],
            "picture": self.user.picture.url if self.user.picture else None,
        }

        return dic


def userinfo(claims, user: User):
    # Populate claims dict.
    claims["name"] = user.name
    claims["email"] = user.email.email
    claims["email_verified"] = user.email.is_valid

    return claims
