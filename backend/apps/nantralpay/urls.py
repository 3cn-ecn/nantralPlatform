from django.urls import path

from rest_framework import routers

from apps.nantralpay.api_views import (
    CashInViewSet,
    ItemViewSet,
    NantralPayEventViewSet,
    OrderViewSet,
    RefillViewSet,
    SaleViewSet,
    TransactionViewSet,
    UserBalanceViewSet,
)
from apps.nantralpay.helloasso_checkout_views import (
    create_payment,
    helloasso_errorurl,
    helloasso_successurl,
)
from apps.nantralpay.helloasso_webhook_view import receive_notification

app_name = "nantralpay"

router = routers.DefaultRouter()
router.register("balance", UserBalanceViewSet, basename="user_balance")
router.register("cash-in", CashInViewSet, basename="cash_in")
router.register("event",
                NantralPayEventViewSet, basename="event_enable")
router.register("item", ItemViewSet, basename="item")
router.register("sale", SaleViewSet, basename="sale")
router.register("order", OrderViewSet, basename="order")
router.register("transaction", TransactionViewSet, basename="transaction")
router.register("refill", RefillViewSet, basename="refill")

urlpatterns = router.urls

# URLs pour HelloAsso
urlpatterns += [
    # Page de création du paiement
    path("checkout/", create_payment, name="ha_create_payment"),
    # Adresses de retour après le paiement
    path("checkout/error/", helloasso_errorurl, name="ha_errorurl"),
    path("checkout/success/", helloasso_successurl, name="ha_successurl"),
    # Adresse pour les notifications webhook
    path("webhook/", receive_notification, name="ha_webhook"),
]
