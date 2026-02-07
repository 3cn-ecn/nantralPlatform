from django.db.models.signals import pre_delete
from django.dispatch import receiver
from django.urls import reverse

from django_rest_passwordreset.models import ResetPasswordToken
from django_rest_passwordreset.signals import reset_password_token_created

from apps.utils.send_email import send_email

from .models import InvitationLink, User


@receiver(pre_delete, sender=InvitationLink)
def set_inactive(sender, instance: InvitationLink, **kwargs):
    User.objects.filter(invitation=instance).update(is_active=False)


@receiver(reset_password_token_created)
def send_reset_email(
    sender,
    instance,
    reset_password_token: ResetPasswordToken,
    *args,
    **kwargs,
):
    """Signal received when a new password token is created

    Parameters
    ----------
    sender : class
        _description_
    instance : View
        View instance that sent the signal
    reset_password_token : ResetPasswordToken
        Created token
    """
    user = reset_password_token.user
    token = reset_password_token.key
    # paths
    update_path = user.get_absolute_url() + "/?tab=password"
    # TODO @rravelli: don't forget to update when frontend implemented  # noqa: TD003
    reset_path = reverse("account:reset-pass", args=[token])
    # sending email
    send_email(
        subject="Réinitialisation de votre mot de passe",
        to=user.email,
        template_name="reset-password",
        context={
            "first_name": user.first_name,
            "email": user.email,
            "reset_password_link": instance.request.build_absolute_uri(
                reset_path,
            ),
            "update_password_link": instance.request.build_absolute_uri(
                update_path,
            ),
        },
    )
