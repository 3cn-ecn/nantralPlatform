from typing import Union
from django.core.mail import send_mail
from django.http import HttpRequest
from django.contrib.auth.models import User
from django.contrib import messages

from apps.account.models import TemporaryAccessRequest
from .forms import SignUpForm, TemporaryRequestSignUpForm
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from .tokens import account_activation_token


def user_creation(form: Union[SignUpForm, TemporaryRequestSignUpForm], request: HttpRequest) -> User:
    user: User = form.save()
    user.student.promo = form.cleaned_data.get('promo')
    user.student.faculty = form.cleaned_data.get('faculty')
    user.student.path = form.cleaned_data.get('path')
    # create a unique user name
    first_name = ''.join(e.lower() for e in form.cleaned_data.get(
        'first_name') if e.isalnum())
    last_name = ''.join(e.lower() for e in form.cleaned_data.get(
        'last_name') if e.isalnum())
    promo = form.cleaned_data.get('promo')
    user.username = f'{first_name}.{last_name}{promo}-{user.id}'
    # user can't login until link confirmed
    user.is_active = False
    user.save()
    if isinstance(
            form, TemporaryRequestSignUpForm):
        temporaryAccessRequest = TemporaryAccessRequest(
            user=user
        )
        domain = get_current_site(request).domain
        temporaryAccessRequest.save(domain=domain)
    send_email_confirmation(user, request, isinstance(
        form, TemporaryRequestSignUpForm))
    return user


def send_email_confirmation(user: User, request: HttpRequest, temporary_access: bool = False, send_to: str = None):
    subject = 'Activation de votre compte Nantral Platform'
    current_site = get_current_site(request)
    # load a template like get_template()
    # and calls its render() method immediately.
    template = 'account/mail/activation_request.html'
    if temporary_access:
        template = 'account/mail/activation_temporary_request.html'
    message = render_to_string(template, {
        'user': user,
        'domain': current_site.domain,
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        # method will generate a hash value with user related data
        'token': account_activation_token.make_token(user),
    })
    if send_to is not None:
        send_mail(subject, message, 'registration@nantral-platform.fr',
                  html_message=message, recipient_list=[send_to])
    else:
        user.email_user(
            subject, message, 'registration@nantral-platform.fr', html_message=message)
    messages.success(
        request, 'Un mail vous a été envoyé pour confirmer votre adresse mail.')
