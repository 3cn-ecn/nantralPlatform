from django.urls import path

from rest_framework import routers

from .views import (
    PaymentViewSet,
    TransactionViewSet,
    cash_in_qrcode,
    create_transaction,
    helloasso_payment_webhook,
)

app_name = "nantralpay"

router = routers.DefaultRouter()
router.register("transaction", TransactionViewSet, basename="transaction")
router.register("payment", PaymentViewSet, basename="payment")

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
]
