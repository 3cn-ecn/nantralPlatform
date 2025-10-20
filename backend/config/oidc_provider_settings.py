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
            "sub": self.user.id,
            "preferred_username": self.user.username,
            "name": self.userinfo["name"],
            "picture": self.user.student.picture.url if self.user.student and self.user.student.picture else None,
        }

        return dic

def userinfo(claims, user: User):
    # Populate claims dict.
    claims["name"] = user.student.name if hasattr(user, "student") else user.username
    claims["email"] = user.email.email
    claims["email_verified"] = user.email.is_valid

    return claims