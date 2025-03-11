import json

from django.db.models import QuerySet
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from rest_framework import permissions, viewsets

from .datawebhook import DATA
from .models import (
    Item,
    ItemSale,
    Payment,
    QRCode,
    Sale,
    Transaction,
)
from .serializers import (
    ItemSaleSerializer,
    ItemSerializer,
    PaymentSerializer,
    QRCodeSerializer,
    SaleSerializer,
    ShortItemSaleSerializer,
    ShortSaleSerializer,
    TransactionSerializer,
)
from .utils import (
    check_qrcode,
    create_payment_from_ha,
    get_items_from_json,
    recalculate_balance,
    update_balance,
)


class NantralPayPermission(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_superuser

    def has_object_permission(self, request, view, obj: Payment) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_superuser


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated, NantralPayPermission]

    def get_queryset(self) -> QuerySet[Transaction]:
        return Transaction.objects.all()


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated, NantralPayPermission]

    def get_queryset(self) -> QuerySet[Payment]:
        return Payment.objects.all()


class QRTransactionViewSet(viewsets.ModelViewSet):
    serializer_class = QRCodeSerializer
    permission_classes = [permissions.IsAuthenticated, NantralPayPermission]

    def get_queryset(self) -> QuerySet[Payment]:
        return QRCode.objects.all()


class SaleViewSet(viewsets.ModelViewSet):
    serializer_class = SaleSerializer
    permission_classes = [
        permissions.DjangoModelPermissions,
        NantralPayPermission,
    ]

    def get_queryset(self) -> QuerySet[Sale]:
        return Sale.objects.all()


class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = [
        permissions.DjangoModelPermissions,
        NantralPayPermission,
    ]

    def get_queryset(self) -> QuerySet[Item]:
        return Item.objects.all()


class ItemSaleViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSaleSerializer
    permission_classes = [
        permissions.DjangoModelPermissions,
        NantralPayPermission,
    ]

    def get_queryset(self) -> QuerySet[ItemSale]:
        return ItemSale.objects.all()


class ShortSaleViewSet(viewsets.ModelViewSet):
    serializer_class = ShortSaleSerializer
    permission_classes = [
        permissions.DjangoModelPermissions,
        NantralPayPermission,
    ]

    def get_queryset(self) -> QuerySet[Sale]:
        return Sale.objects.all()


class ShortItemSaleViewSet(viewsets.ModelViewSet):
    serializer_class = ShortItemSaleSerializer
    permission_classes = [
        permissions.DjangoModelPermissions,
        NantralPayPermission,
    ]

    def get_queryset(self) -> QuerySet[ItemSale]:
        return ItemSale.objects.all()


# Vue pour gérer les notifications de paiement HelloAsso
@csrf_exempt
@require_http_methods(["POST", "GET"])
def helloasso_payment_webhook(request):
    try:
        data = (
            json.loads(DATA)
            if request.method == "GET"
            else json.loads(request.body)
        )

        event_type = data.get("eventType")
        order_data = data.get("data", {})
        form_slug = order_data.get("formSlug")

        # Vérifier que l'événement est bien un paiement reçu
        if event_type == "Order" and form_slug == "nantralpay":
            payment_date = data.get("date")
            orders = order_data.get("items")
            for item in orders:
                user = create_payment_from_ha(item, payment_date)
                if user:
                    recalculate_balance(user)

            return HttpResponse(status=200)
        else:
            return JsonResponse({"error": "Unhandled event type"}, status=400)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def create_transaction(request):
    try:
        # Crée un nouveau QR code
        qr_code = QRCode.objects.create(
            user=request.user,
        )

        # Renvoyer l'ID de la transaction
        return JsonResponse({"qr_code_id": qr_code.id}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON invalide"}, status=400)


@require_http_methods(["GET"])
def qrcode(request, transaction_id):
    match check_qrcode(transaction_id):
        case QRCode():
            return redirect(f"/nantralpay/cash-in/{transaction_id}/")
        case JsonResponse() as res:
            return res


@csrf_exempt
@require_http_methods(["POST"])
def cash_in_qrcode(request, transaction_id):
    # Récupérer l'utilisateur actuellement connecté
    receiver = request.user

    match check_qrcode(transaction_id):
        case QRCode() as qr_code:
            # Récupérer l'utilisateur à facturer
            sender = qr_code.user

            match get_items_from_json(request.body):
                case JsonResponse() as res:
                    return res
                case items, amount:
                    # Vérifier si le solde du sender est suffisant
                    if qr_code.user.nantralpay_balance < amount:
                        return JsonResponse(
                            {"error": "The sender does not have enough money."},
                            status=400,
                        )

                    # Récupérer le groupe du receiver
                    groups = receiver.student.membership_set.filter(
                        can_use_nantralpay=True
                    ).filter(group__slug__in=["bde", "bda", "bds"])
                    if len(groups) == 0:
                        return JsonResponse(
                            {"error": "You are not allowed to use NantralPay."},
                            status=403,
                        )
                    elif len(groups) > 1:
                        return JsonResponse(
                            {
                                "error": "You are in too many groups. Please contact an administrator."
                            },
                            status=403,
                        )
                    group = groups.first().group

                    # Mettre à jour le solde du group et du sender
                    update_balance(group, amount)
                    update_balance(sender, -amount)

                    # Créer la transaction
                    transaction = Transaction.objects.create(
                        receiver=receiver,
                        sender=sender,
                        amount=amount,
                        description=f"Cash-in QR Code {transaction_id}",
                        group=group,
                    )
                    # Créer la vente
                    sale = Sale.objects.create(
                        user=sender, transaction=transaction
                    )

                    ItemSale.objects.bulk_create(
                        [
                            ItemSale(
                                sale=sale,
                                item=item["item"],
                                quantity=item["quantity"],
                            )
                            for item in items
                        ]
                    )
                    # Mettre à jour le QR Code
                    qr_code.transaction = transaction
                    qr_code.save()

                    return JsonResponse(
                        {
                            "success": "Transaction has been added",
                            "transaction_id": str(qr_code.transaction_id),
                        }
                    )
        case JsonResponse() as res:
            return res
