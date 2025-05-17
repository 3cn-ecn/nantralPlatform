import json
from decimal import Decimal

from django.http import HttpResponse

from apps.nantralpay.models import Order, Transaction
from apps.nantralpay.utils import require_ip, update_balance

HELLOASSO_PROD = False
HELLOASSO_PROD_IP = "51.138.206.200"
HELLOASSO_DEV_IP = "4.233.135.234"
HELLOASSO_IP = HELLOASSO_PROD_IP if HELLOASSO_PROD else HELLOASSO_DEV_IP


def handle_payment(json_data):
    """Triggered when a payment is created or updated"""
    data = json_data.get("data")
    # Rien à faire si ce n'est pas un checkout
    if data.get("order").get("formType") != "Checkout":
        return HttpResponse("Nothing to do")

    # Récupération du Paiement
    payment_id = data.get("id")
    try:
        payment = Transaction.objects.get(helloasso_payment_id=payment_id)
    except Transaction.DoesNotExist:
        return HttpResponse("Payment not found")

    # Mise à jour du paiement
    if (
        payment.payment_status in Transaction.valid_payment_status
        and data.get("state") in Transaction.invalid_payment_status
    ):
        # Si le statut du paiement est devenu invalide, on retire le montant du paiement
        update_balance(payment.order.user, -payment.amount)
    if (
        payment.payment_status in Transaction.invalid_payment_status
        and data.get("state") in Transaction.valid_payment_status
    ):
        # Si le statut du paiement est redevenu valide, on ajoute le montant du paiement
        update_balance(payment.order.user, payment.amount)

    payment.payment_status = data.get("state")
    payment.save()

    return HttpResponse("OK")


def handle_form(json_data):
    """Triggered when a form is created

    This is not needed
    """
    return HttpResponse("OK")


def handle_order(json_data):
    data = json_data.get("data")
    # Rien à faire si ce n'est pas un checkout
    if data.get("order").get("formType") != "Checkout":
        return HttpResponse("Nothing to do")

    # Récupération des données JSON
    amount = Decimal(data.get("amount").get("total")).shift(-2)
    helloasso_order_id = data.get("id")
    checkout_intent_id = data.get("checkoutIntentId")

    # Récupération du CheckoutIntent
    try:
        order = Order.objects.get(checkout_intent_id=checkout_intent_id)
    except Order.DoesNotExist:
        return HttpResponse("CheckoutIntent not found")

    # Création de la commande et des paiements
    order.helloasso_order_id = helloasso_order_id
    if order.amount != amount:
        return HttpResponse(f"Amount mismatch: {order.amount} != {amount}")

    order.save()

    Transaction.objects.bulk_create(
        [
            Transaction(
                amount=payment.get("amount"),
                date=payment.get("date"),
                helloasso_payment_id=payment.get("id"),
                order=order,
                payment_status=payment.get("state"),
            )
            for payment in data.get("payments")
        ]
    )

    return HttpResponse("OK")


def handle_organization(json_data):
    """Changes the organization's slug

    This is important because the organization's slug is used to identify the organization
    when using the Checkout API.

    To do: Need to change the url where the checkout redirects
    """
    return HttpResponse("Not implemented")


@require_ip([HELLOASSO_IP])
def receive_notification(request):
    """Reçoit les notifications Webhook de Helloasso

    Ne doit pas renvoyer de code d'erreur, sinon Helloasso renverra la requête
    """
    try:
        json_data = json.loads(request.body)

        if json_data["eventType"] == "Payment":
            return handle_payment(json_data)

        elif json_data["eventType"] == "Order":
            return handle_order(json_data)

        elif json_data["eventType"] == "Form":
            return handle_form(json_data)

        elif json_data["eventType"] == "Organization":
            return handle_organization(json_data)

        else:
            return HttpResponse("Unknown event type")

    except json.JSONDecodeError:
        return HttpResponse("Invalid JSON data")
