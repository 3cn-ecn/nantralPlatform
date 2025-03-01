from django.urls import path

from rest_framework import routers

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
    helloasso_payment_webhook,
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
    path(
        "helloasso-webhook/",
        helloasso_payment_webhook,
        name="helloasso_webhook",
    ),
    path(
        "create-transaction/",
        create_transaction,
        name="create_transaction",
    ),
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
