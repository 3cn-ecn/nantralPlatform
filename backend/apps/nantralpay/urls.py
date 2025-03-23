from django.urls import path

from rest_framework import routers

from apps.nantralpay.helloasso_checkout_views import (
    create_payment,
    helloasso_errorurl,
    helloasso_successurl,
)
from apps.nantralpay.helloasso_webhook_view import receive_notification

from .views import (
    ItemViewSet,
    PaymentViewSet,
    SaleViewSet,
    TransactionViewSet,
    create_qrcode,
    qrcode,
    user_info,
)

app_name = "nantralpay"

router = routers.DefaultRouter()
router.register("transaction", TransactionViewSet, basename="transaction")
router.register("payment", PaymentViewSet, basename="payment")
router.register("sale", SaleViewSet, basename="sale")
router.register("item", ItemViewSet, basename="item")

urlpatterns = router.urls

urlpatterns += [
    # Infos sur l'utilisateur
    path("user/", user_info, name="user-info"),
    # Page de création du paiement
    path("checkout/", create_payment, name="helloasso_create_payment"),
    # Adresses de retour après le paiement
    path("checkout/error/", helloasso_errorurl, name="helloasso_errorurl"),
    path(
        "checkout/success/", helloasso_successurl, name="helloasso_successurl"
    ),
    # Adresse pour les notifications webhook
    path("webhook/", receive_notification, name="helloasso_webhook"),
    path("create-qrcode/", create_qrcode, name="create-qrcode"),
    path("qrcode/<uuid:qrcode_id>/", qrcode, name="qrcode"),
]
