from datetime import timedelta

from django.core.exceptions import (
    PermissionDenied,
    ValidationError,
)
from django.http import HttpResponseForbidden
from django.utils import timezone
from django.utils.translation import gettext as _

from apps.group.models import Group

from ..account.models import User
from .models import Payment, QRCode, Transaction

QRCode_expiration_time = 2  # Durée (en minutes) avant que le QRCode périme


def update_balance(receiver: User | Group, amount: int):
    """Update the balance by adding the amount to the previous balance
    Pretty quick"""
    receiver.nantralpay_balance += amount
    receiver.save()


def recalculate_balance(user: User):
    """Recalculate the user's balance by taking all the payments and transactions in account.
    It takes time"""
    balance = 0
    for payment in Payment.objects.filter(user=user).values("amount"):
        balance += payment["amount"]

    for transaction in Transaction.objects.filter(sender=user).values("amount"):
        balance -= transaction["amount"]

    user.nantralpay_balance = balance
    user.save()


def group_recalculate_balance(group: Group):
    """Recalculate the group's balance by taking all the transactions in account.
    It takes time"""
    balance = 0

    for transaction in Transaction.objects.filter(group=group).values("amount"):
        balance -= transaction["amount"]

    group.nantralpay_balance = balance
    group.save()


def check_qrcode(qr_code: QRCode):
    """Vérifie la validité du QR Code

    Parameters
    ----------
    qr_code : QRCode
        QR Code à vérifier

    Raises
    ------
    ValidationError
        Le QR code ne peut pas être utilisé
    """

    # Vérifier si la transaction n'est pas déjà enregistrée
    if qr_code.transaction is not None:
        raise ValidationError("This QR code has already been cashed in.")

    # Vérifier si le QR code n'est pas périmé
    current_time = (
        timezone.now()
    )  # Utilise la méthode correcte de Django pour obtenir l'heure actuelle
    expiration_time = qr_code.creation_date + timedelta(
        minutes=QRCode_expiration_time
    )
    if current_time > expiration_time:
        raise ValidationError("This QR code has expired.")

    return qr_code


def require_ip(allowed_ip_list):
    def decorator(view_func):
        def authorize(request, *args, **kwargs):
            user_ip = request.META["REMOTE_ADDR"]
            if user_ip not in allowed_ip_list:
                return HttpResponseForbidden("You cannot access this page")
            else:
                return view_func(request, *args, **kwargs)

        return authorize

    return decorator


def get_user_group(user):
    groups = user.student.membership_set.filter(can_use_nantralpay=True).filter(
        group__slug__in=["bde", "bda", "bds"]
    )
    if len(groups) == 0:
        raise PermissionDenied(_("You are not allowed to use NantralPay."))
    elif len(groups) > 1:
        raise PermissionDenied(
            _("You are in too many groups. Please contact an administrator.")
        )
    return groups.first().group
