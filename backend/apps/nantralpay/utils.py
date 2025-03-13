import json
from datetime import timedelta
from decimal import Decimal

from django.http import HttpResponseForbidden, JsonResponse
from django.utils import timezone
from django.utils.translation import gettext as _

from requests import Response

from apps.group.models import Group

from ..account.models import User
from .models import Item, Payment, QRCode, Transaction

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


def check_qrcode(qr_code_uuid: str) -> Response | QRCode:
    """Vérifie la validité du QR Code

    Parameters
    ----------
    qr_code : QRCode
        Identifiant du QR Code à vérifier

    Returns
    -------
    Response | QRCode
        Objet `QRCode` si le QR code est correct, réponse d'erreur sinon
    """
    # Récupérer l'instance de QRCode avec le qr_code_uuid
    try:
        qr_code = QRCode.objects.get(id=qr_code_uuid)
    except QRCode.DoesNotExist:
        return JsonResponse({"error": "QR Code not found"}, status=404)

    # Vérifier si la transaction n'est pas déjà enregistrée
    if qr_code.transaction is not None:
        return JsonResponse(
            {"error": "This QR code has already been cashed in."}, status=400
        )

    # Vérifier si le QR code n'est pas périmé
    current_time = (
        timezone.now()
    )  # Utilise la méthode correcte de Django pour obtenir l'heure actuelle
    expiration_time = qr_code.creation_date + timedelta(
        minutes=QRCode_expiration_time
    )
    if current_time > expiration_time:
        return JsonResponse({"error": "This QR code has expired."}, status=400)

    return qr_code


def get_items_from_json(json_data):
    # Récupérer le montant du paiement
    items = []
    amount = Decimal(0)
    try:
        # Parse le corps de la requête JSON
        data = json.loads(json_data)
        for item in data:
            item_id = item.get("id")
            quantity = item.get("quantity")

            # Vérification de l'ID
            if not item_id:
                return JsonResponse(
                    {"error": "Identifiant produit manquant"}, status=400
                )
            try:
                item_object = Item.objects.get(id=item_id)
            except Item.DoesNotExist:
                return JsonResponse(
                    {"error": "Identifiant produit invalide"}, status=400
                )

            # Vérification de la quantité
            if not isinstance(quantity, int) or quantity <= 0:
                return JsonResponse({"error": "Quantité invalide"}, status=400)

            items.append({"item": item_object, "quantity": quantity})
            amount += item_object.price * quantity

    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON invalide"}, status=400)
    if len(items) == 0:
        return JsonResponse({"error": "Aucun produit vendu"}, status=400)
    return items, amount


def require_ip(allowed_ip_list):
    def new_func(view_func):
        def authorize(request, *args, **kwargs):
            user_ip = request.META["REMOTE_ADDR"]
            if user_ip not in allowed_ip_list:
                return HttpResponseForbidden("You cannot access this page")
            else:
                return view_func(request, *args, **kwargs)

        return authorize

    return new_func


def get_user_group(user):
    groups = user.student.membership_set.filter(can_use_nantralpay=True).filter(
        group__slug__in=["bde", "bda", "bds"]
    )
    if len(groups) == 0:
        raise PermissionError(_("You are not allowed to use NantralPay."))
    elif len(groups) > 1:
        raise PermissionError(
            _("You are in too many groups. Please contact an administrator.")
        )
    return groups.first().group
