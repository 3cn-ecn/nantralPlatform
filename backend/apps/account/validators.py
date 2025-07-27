import re

from django.contrib.auth.password_validation import validate_password
from django.core import validators
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.translation import gettext_lazy as _

from rest_framework.exceptions import ValidationError


class MatrixUsernameValidator(validators.RegexValidator):
    regex = r"^[a-z0-9.\-+][a-z0-9._\-+]*\Z"
    message = _(
        "Entrez un nom d'utilisateur valide. Il doit être composé de lettres minuscules "
        "de chiffres et des caractères . _ - +. Il ne doit pas commencer par _"
    )
    flags = 0


class EcnEmailValidator(validators.EmailValidator):
    """This validator checks if an email address is from
    École Centrale Nantes or Centrale Nantes Alumni which
    means that the user  belongs to Centrale Nantes

    It disables all the domains by changing the regex that checks
    if a domain is valid, and sets a list of domain that bypass
    the check.
    """
    domain_regex = re.compile(r"(?!)")  # This matches nothing
    domain_allowlist = [
        "eleves.ec-nantes.fr",
        "ec-nantes.fr",
        "centraliens-nantes.org",
        # For local
        "fake.ec-nantes.fr",
    ]
    message = _("Vous devez utiliser une addresse mail ECN valide (ec-nantes.fr ou centraliens-nantes.org)")


def validate_email(mail: str):
    if "+" in mail:
        raise ValidationError(
            "L'adresse email ne doit pas contenir de caractères spéciaux",
        )


def django_validate_password(password):
    try:
        # validate the password against existing validators
        validate_password(password)
    except DjangoValidationError as e:
        # raise a validation error for the serializer
        raise ValidationError(e.messages)


matrix_username_validator = MatrixUsernameValidator()
ecn_email_validator = EcnEmailValidator()