import json

from django.http import HttpResponse

from apps.nantralpay.models import Order, Payment


def handle_payment(json_data):
    """Triggered when a payment is created or updated"""
    data = json_data.get("data")
    # Rien à faire si ce n'est pas un checkout
    if data.get("order").get("formType") != "Checkout":
        return HttpResponse("Nothing to do")

    # Récupération du Paiement
    payment_id = data.get("id")
    try:
        payment = Payment.objects.get(helloasso_payment_id=payment_id)
    except Payment.DoesNotExist:
        return HttpResponse("Payment not found")

    # Mise à jour du paiement
    payment.payment_status = data.get("state")
    payment.payment_cash_out_state = data.get("cashOutState")
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
    amount = data.get("amount").get("total")
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

    Payment.objects.bulk_create(
        [
            Payment(
                amount=payment.get("amount"),
                payment_date=payment.get("date"),
                helloasso_payment_id=payment.get("id"),
                order=order,
                payment_status=payment.get("state"),
                payment_cash_out_state=payment.get("cashOutState"),
            )
            for payment in data.get("payments")
        ]
    )

    return HttpResponse("OK")


def handle_organization(json_data):
    """Changes the organization's slug

    This is important because the organization's slug is used to identify the organization
    when using the Checkout API.

    To do
    """
    return HttpResponse("Not implemented")


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
