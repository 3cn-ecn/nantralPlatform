import re
import unicodedata

from django.contrib import messages
from django.http import HttpRequest
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from apps.utils.send_email import send_email

from .forms import SignUpForm, TemporaryRequestSignUpForm
from .models import InvitationLink, User
from .tokens import account_activation_token


def clean_username(username: str):
    normalized = unicodedata.normalize("NFKD", username)  # split the Unicode characters
    normalized = normalized.lower()
    cleaned = re.sub(r"[^a-z0-9._\-+]", "", normalized)  # remove unauthorized Unicode chars
    cleaned.strip("_")  # just to be sure, remove leading underscores (and trailing, but we don't care)
    return cleaned


def user_creation(
    form: SignUpForm | TemporaryRequestSignUpForm,
    request: HttpRequest,
    invitation: InvitationLink | None = None,
) -> User:
    # save with username = email by default
    user: User = form.instance
    user.username = user.email
    form.save()

    user.student.promo = form.cleaned_data.get("promo")
    user.student.faculty = form.cleaned_data.get("faculty")
    user.student.path = form.cleaned_data.get("path")
    if user.first_name is not None:
        user.first_name = user.first_name.lower()
    if user.last_name is not None:
        user.last_name = user.last_name.lower()
    # create a unique user name
    promo = user.student.promo
    user.username = clean_username(f"{user.first_name}.{user.last_name}.{promo}.{user.id}")
    if isinstance(form, TemporaryRequestSignUpForm):
        user.invitation = invitation
    user.save()
    send_email_confirmation(
        user,
        request,
        isinstance(form, TemporaryRequestSignUpForm),
    )
    return user


def send_email_confirmation(
    user: User,
    request: HttpRequest,
    temporary_access: bool = False,
    send_to: str | None = None,
) -> None:
    path = reverse(
        "account:confirm",
        kwargs={
            "uidb64": urlsafe_base64_encode(force_bytes(user.pk)),
            "token": account_activation_token.make_token(user),
        },
    )
    context = {
        "first_name": user.first_name,
        "validation_link": request.build_absolute_uri(path),
    }

    send_email(
        subject="Activation de votre compte Nantral Platform",
        to=send_to or user.email,
        template_name="email-confirmation",
        context=context,
    )

    if temporary_access:
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
