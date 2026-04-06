import re
import string

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.translation import gettext_lazy as _

from rest_framework.exceptions import ValidationError

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
    if re.search(r"@eleves\.ec-nantes\.fr$", mail) is not None:
        return "EC-Nantes Student"
    elif re.search(r"@ec-nantes\.fr$", mail) is not None:
        return "EC-Nantes Staff"
    elif re.search(r"@centraliens-nantes\.org$", mail) is not None:
        return "EC-Nantes Alumni"
    elif re.search(r"@fake\.ec-nantes\.fr$", mail) is not None:
        return "Test email"
    else:
        raise ValidationError(
            _(
                "You must use a valid email address from an authorized organization."
            ),
        )


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
