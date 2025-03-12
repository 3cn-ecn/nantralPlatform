from django.urls import path

from rest_framework import routers

from apps.nantralpay.helloasso_checkout_views import (
    create_payment,
    helloasso_errorurl,
    helloasso_successurl,
)
from apps.nantralpay.helloasso_webhook_view import receive_notification

from .views import (
    ItemSaleViewSet,
    ItemViewSet,
    PaymentViewSet,
    SaleViewSet,
    ShortItemSaleViewSet,
    ShortSaleViewSet,
    TransactionViewSet,
    cash_in_qrcode,
    create_transaction,
    qrcode,
)

app_name = "nantralpay"

router = routers.DefaultRouter()
router.register("transaction", TransactionViewSet, basename="transaction")
router.register("payment", PaymentViewSet, basename="payment")
router.register("sale", SaleViewSet, basename="sale")
router.register("item", ItemViewSet, basename="item")
router.register("item-sale", ItemSaleViewSet, basename="item-sale")
router.register("sale-short", ShortSaleViewSet, basename="sale-short")
router.register(
    "item-sale-short", ShortItemSaleViewSet, basename="item-sale-short"
)

urlpatterns = router.urls

urlpatterns += [
    # Page de création du paiement
    path("checkout/", create_payment, name="helloasso_create_payment"),
    # Adresses de retour après le paiement
    path("checkout/error/", helloasso_errorurl, name="helloasso_errorurl"),
    path(
        "checkout/success/", helloasso_successurl, name="helloasso_successurl"
    ),
    # Adresse pour les notifications webhook
    path("webhook/", receive_notification, name="helloasso_webhook"),
    path("create-transaction/", create_transaction, name="create_transaction"),
    path(
        "cash-in-qrcode/<uuid:transaction_id>/",
        cash_in_qrcode,
        name="cash_in_qrcode",
    ),
    path(
        "qrcode/<uuid:transaction_id>/",
        qrcode,
        name="qrcode",
    ),
]
