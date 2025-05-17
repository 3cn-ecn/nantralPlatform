from datetime import timedelta

from apps.group.models import Group
from django.core.exceptions import (
    PermissionDenied,
    ValidationError,
)
from django.utils import timezone

from ..account.models import User
from .models import Sale, Transaction

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
    for payment in Transaction.objects.filter(user=user, payment_satus__in=Transaction.valid_payment_status).values("amount"):
        balance += payment["amount"]

    for sale in Sale.objects.filter(user=user):
        balance -= sale.get_price()

    user.nantralpay_balance = balance
    user.save()


def group_recalculate_balance(group: Group):
    """Recalculate the group's balance by taking all the transactions in account.
    It takes time"""
    balance = 0

    for sale in Sale.objects.filter(seller__event__group=group):
        balance -= sale.get_price()

    group.nantralpay_balance = balance
    group.save()


def check_sale(sale: Sale):
    """Vérifie la validité d'une vente scannée par un QR code

    Parameters
    ----------
    sale : Sale
        La vente à vérifier

    Raises
    ------
    ValidationError
        La vente n'est pas valide
    """

    # Vérifier si la vente n'est pas déjà enregistrée
    if sale.cash_in_date is None:
        raise ValidationError("This sale has already been cashed in.")

    # Vérifier si la vente n'est pas périmé
    current_time = (
        timezone.now()
    )  # Utilise la méthode correcte de Django pour obtenir l'heure actuelle
    expiration_time = sale.creation_date + timedelta(
        minutes=QRCode_expiration_time
    )
    if current_time > expiration_time:
        raise ValidationError("This sale has expired.")

    return sale


def require_ip(allowed_ip_list):
    def decorator(view_func):
        def authorize(request, *args, **kwargs):
            user_ip = request.META["REMOTE_ADDR"]
            if user_ip not in allowed_ip_list:
                raise PermissionDenied()
            else:
                return view_func(request, *args, **kwargs)

        return authorize

    return decorator
