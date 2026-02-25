import re
import unicodedata

from django.contrib import messages
from django.http import HttpRequest
from django.urls import reverse

from apps.utils.send_email import send_email

from .tokens import email_confirmation_token


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
    return cleaned


def send_email_confirmation(email, request: HttpRequest) -> None:
    path = reverse(
        "account:confirm",
        kwargs={
            "email_uuid": email.uuid,
            "token": email_confirmation_token.make_token(email),
        },
    )
    context = {
        "first_name": email.user.first_name,
        "validation_link": request.build_absolute_uri(path),
    }

    try:
        send_email(
            subject="Activation de votre compte Nantral Platform",
            to=email.email,
            template_name="email-confirmation",
            context=context,
        )
    except Exception:
        messages.error(
            request,
            (
                "Une erreur est survenue lors de l'envoi du mail. "
                "Merci de contacter l'administrateur."
            ),
        )
        return

    if request:
        if not email.is_ecn_email():
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
                    "Centrale Nantes.\nVous pouvez accéder à votre boîte mail "
                    'école <a href="https://webmail.ec-nantes.fr">ici</a>.'
                ),
            )
