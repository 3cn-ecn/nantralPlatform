import re
import unicodedata

from django.contrib import messages
from django.http import HttpRequest
from django.urls import reverse

from apps.utils.send_email import send_email

from .tokens import email_confirmation_token


class AuthorizedOrganization:
    """Class representing an authorized organization."""

    def __init__(
        self,
        pattern: str,
        organization: str,
        email_validation_priority: int,
        account_organization_priority: int,
    ):
        """Initialize the object

        Args:
            pattern (str): Regex associated with the organization email pattern
            organization (str): Name of the organization
            email_validation_priority (int): Determines the order of validation of email patterns. The lower the number, the higher the priority.
            account_organization_priority (int): Determines the order of organization assignment when multiple patterns match an email. The lower the number, the higher the priority.
        """
        self.pattern = re.compile(pattern)
        self.organization = organization
        self.email_validation_priority = email_validation_priority
        self.account_organization_priority = account_organization_priority

    def validate(self, email: str) -> bool:
        return self.pattern.search(email) is not None


def clean_username(username: str):
    normalized = unicodedata.normalize(
        "NFKD", username
    )  # split the Unicode characters
    normalized = normalized.lower()
    cleaned = re.sub(
        r"[^a-z0-9._\-]", "", normalized
    )  # remove unauthorized Unicode chars
    cleaned.strip(
        "_"
    )  # just to be sure, remove leading underscores (and trailing, but we don't care)
    if cleaned.isdigit():
        # add an underscore at the end since usernames can't be only digits
        cleaned += "_"
    return cleaned


def send_email_confirmation(email, request: HttpRequest | None = None) -> None:
    path = reverse(
        "account:confirm",
        kwargs={
            "email_uuid": email.uuid,
            "token": email_confirmation_token.make_token(email),
        },
    )

    # Build validation link with or without request
    if request:
        validation_link = request.build_absolute_uri(path)
    else:
        validation_link = f"https://nantral-platform.fr/{path}"

    context = {
        "first_name": email.user.first_name,
        "validation_link": validation_link,
    }

    try:
        send_email(
            subject="Activation de votre compte Nantral Platform",
            to=email.email,
            template_name="email-confirmation",
            context=context,
        )
    except Exception:
        if request:
            messages.error(
                request,
                (
                    "Une erreur est survenue lors de l'envoi du mail. "
                    "Merci de contacter l'administrateur."
                ),
            )
        return

    if request:
        if not email.is_authorized_organisation_email():
            messages.success(
                request,
                (
                    "Un mail vous a été envoyé pour confirmer "
                    "votre adresse mail personnelle."
                ),
            )
        else:
            messages.success(
                request,
                (
                    "Un mail vous a été envoyé pour confirmer votre adresse mail "
                    "institutionnelle.\nVous pouvez accéder à votre boîte mail "
                    'école <a href="https://webmail.ec-nantes.fr">ici</a>.'
                ),
            )
