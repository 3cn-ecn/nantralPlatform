import re

from django.contrib.auth.password_validation import validate_password
from django.core import validators
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.translation import gettext_lazy as _

from rest_framework.exceptions import ValidationError


class MatrixUsernameValidator(validators.RegexValidator):
    regex = r"^[a-z0-9.\-+][a-z0-9._\-+]*$"
    message = _(
        "Enter a valid username. This value may contain only lower case letters, "
        "numbers, and . _ - + characters. It may not start with _"
    )
    flags = 0


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


def ecn_email_validator(mail: str):
    if re.search(r"@([\w\-.]+\.)?(ec-nantes\.fr|centraliens-nantes\.org)$", mail) is None:
        raise ValidationError(
            _("You must use a valid ECN email address (ending in ec-nantes.fr or centraliens-nantes.org)"),
        )


matrix_username_validator = MatrixUsernameValidator()
