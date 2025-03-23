import json

from django.http import HttpResponseServerError
from django.http.response import HttpResponseBadRequest
from django.shortcuts import redirect, render
from django.urls import reverse

import requests

from .forms import RechargeForm
from .helloasso_utils import get_token
from .models import Order

HELLOASSO_ORG_SLUG = "association-des-etudiants-de-l-ecole-centrale-nantes"

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
                ),  # à faire: garder le montant demandé dans le formulaire
                "errorUrl": reverse("helloasso:helloasso_errorurl"),
                "returnUrl": reverse("helloasso:helloasso_successurl"),
                "containsDonation": True,
                "payer": {
                    "firstName": request.user.first_name,
                    "lastName": request.user.last_name,
                    "email": request.user.email,
                },
            }
            headers = {
                "accept": "application/json",
                "content-type": "application/*+json",
                "authorization": f"Bearer {get_token()}",
            }

            response = requests.post(
                f"https://api.helloasso.com/v5/organizations/{HELLOASSO_ORG_SLUG}/checkout-intents",
                json=body,
                headers=headers,
                timeout=60,
            )
            if not response.ok:
                return HttpResponseServerError("Failed to create payment")

            # Parse response JSON
            try:
                response_data = response.json()
            except json.JSONDecodeError:
                return HttpResponseBadRequest("Failed to decode response JSON")

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
    # à faire: Revenir sur le form avec un message d'erreur
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
        return HttpResponseBadRequest("HelloAsso payment refused")
