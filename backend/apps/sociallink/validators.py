from django.core.validators import (
    URLValidator,
    EmailValidator,
    RegexValidator
)
from django.core.exceptions import ValidationError


def validate_uri(value: str):
    """A validator for URI.

    Parameters
    ----------
    value : str
        _description_

    Raises
    ------
    exceptions.ValidationError
        _description_
    """
    if value.startswith(('http:', 'https:')):
        URLValidator()(value)
    elif value.startswith('mailto:'):
        EmailValidator()(value[7:])
    elif value.startswith('tel:'):
        RegexValidator(
            regex=r'^\+?[\d\.\s]+$',
            message="Enter a valid phone number."
        )(value[4:])
    else:
        raise ValidationError(
            "The URI is not valid: it must start with 'https:', 'mailto:', or "
            "'tel:'."
        )
