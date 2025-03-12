import json

from django.http import HttpResponseServerError
from django.shortcuts import redirect, render
from django.urls import reverse

import requests

from apps.nantralpay.forms import RechargeForm
from apps.nantralpay.models import Order


def create_payment(request):
    if request.method == "POST":
        form = RechargeForm(request.POST)

        if form.is_valid():
            amount = form.cleaned_data["amount"]

            body = {
                "totalAmount": int(amount.shift(2)),
                "initialAmount": int(amount.shift(2)),
                "itemName": "Recharge du compte NantralPay",
                "backUrl": reverse(
                    "helloasso:helloasso_create_payment"
                ),  # TODO: keep the requested amount in the form
                "errorUrl": reverse("helloasso:helloasso_errorurl"),
                "returnUrl": reverse("helloasso:helloasso_successurl"),
                "containsDonation": True,
                "payer": {
                    "firstName": request.user.first_name,
                    "lastName": request.user.last_name,
                    "email": request.user.email,
                },
            }

            response = requests.post(
                "https://api.helloasso.com/v5/organizations/{organizationSlug}/checkout-intents",
                json=body,
                timeout=60,
            )  # TODO: Implement authentication for Helloasso API
            if not response.ok:
                return HttpResponseServerError("Failed to create payment")

            # Parse response JSON
            try:
                response_data = response.json()
            except json.JSONDecodeError:
                return HttpResponseServerError("Failed to decode response JSON")

            intent_id = response_data["id"]
            redirect_url = response_data["redirectUrl"]

            # Create a new Order
            Order.objects.create(
                user=request.user,
                checkout_intent_id=intent_id,
                amount=amount,
            )

            # Redirect to Helloasso for payment
            return redirect(redirect_url)
    else:
        form = RechargeForm()

    return render(request, "checkout/form.html", {"form": form})


def helloasso_errorurl(request):
    # TODO: Go back to the form with an error message
    return HttpResponseServerError(
        f'HelloAsso payment failed: {request.GET["error"]}'
    )


def helloasso_successurl(request):
    if request.GET["code"] == "success":
        # Mise à jour de la commande avec l'ID HelloAsso
        try:
            order = Order.objects.get(
                checkout_intent_id=request.GET["checkoutIntentId"]
            )
        except Order.DoesNotExist:
            return HttpResponseServerError("HelloAsso order not found")
        order.helloasso_order_id = request.GET["orderId"]
        order.save()

        # Rediriger vers la page d'accueil
        return redirect("core:home")
    else:
        return HttpResponseServerError("HelloAsso payment refused")
