import re
import string

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.translation import gettext_lazy as _

from rest_framework.exceptions import ValidationError

from .utils import AuthorizedOrganization

MXID_LOCALPART_ALLOWED_CHARACTERS = set(
    "_-.+" + string.ascii_lowercase + string.digits
)
GUEST_USER_ID_PATTERN = re.compile(r"^\d+$")

RESERVED_USERNAMES = (
    "bot",
    "admin",
    "server",
    "internal",
    "guest",
    "matrix",
    "bde",
    "bds",
    "bda",
    "ecn",
    "test",
    "bridge",
)

AUTHORIZED_ORGANIZATIONS = [
    AuthorizedOrganization(
        r"@eleves\.ec-nantes\.fr$",
        "EC-Nantes Student",
        email_validation_priority=5,
        account_organization_priority=9,
    ),
    AuthorizedOrganization(
        r"@ec-nantes\.fr$",
        "EC-Nantes Staff",
        email_validation_priority=3,
        account_organization_priority=10,
    ),
    AuthorizedOrganization(
        r"@centraliens-nantes\.org$",
        "EC-Nantes Alumni",
        email_validation_priority=3,
        account_organization_priority=8,
    ),
    AuthorizedOrganization(
        r"@fake\.ec-nantes\.fr$",
        "EC-Nantes Fake Email",
        email_validation_priority=4,
        account_organization_priority=11,
    ),
    AuthorizedOrganization(
        r"supmaritime\.fr$",
        "EC-Nantes Fake Email",
        email_validation_priority=5,
        account_organization_priority=9,
    )
]
AUTHORIZED_ORGANIZATIONS.sort(key=lambda org: org.email_validation_priority)

def validate_matrix_username(value):
    if any(c not in MXID_LOCALPART_ALLOWED_CHARACTERS for c in value):
        raise ValidationError(
            _(
                "Enter a valid username. This value can only contain characters a-z, 0-9, or '_-.+'"
            )
        )

    if value[0] == "_":
        raise ValidationError(_("Username may not begin with _"))

    if GUEST_USER_ID_PATTERN.fullmatch(value):
        raise ValidationError(_("Numeric username are reserved"))

    if value.lower() in RESERVED_USERNAMES or any(
        value.lower().startswith(p + ".") for p in RESERVED_USERNAMES
    ):
        raise ValidationError(_("This username is reserved"))


def validate_email(mail: str):
    if "+" in mail:
        raise ValidationError(
            _("The email address should not include special characters"),
        )


def django_validate_password(password):
    try:
        # validate the password against existing validators
        validate_password(password)
    except DjangoValidationError as e:
        # raise a validation error for the serializer
        raise ValidationError(e.messages)


def organisation_email_validator(mail: str):
    for org in AUTHORIZED_ORGANIZATIONS:
        if org.validate(mail):
            return org.organization
    raise ValidationError(
        _(
            "You must use a valid email address from an authorized organization."
        ),
    )

def get_user_organization(emails):
    """Get the organization of a user based on their email addresses.

    If multiple email addresses are valid, the one with the highest priority is chosen.
    """
    valid_orgs = []
    for email in emails:
        for org in AUTHORIZED_ORGANIZATIONS:
            if org.validate(email.email):
                valid_orgs.append(org)
                break
    if not valid_orgs:
        return None
    valid_orgs.sort(key=lambda org: org.account_organization_priority)
    return valid_orgs[0].organization

def ecn_email_validator(mail: str):
    if (
        re.search(
            r"@([\w\-.]+\.)?(ec-nantes\.fr|centraliens-nantes\.org)$", mail
        )
        is None
    ):
        raise ValidationError(
            _(
                "You must use a valid ECN email address (ending in ec-nantes.fr or centraliens-nantes.org)"
            ),
        )
