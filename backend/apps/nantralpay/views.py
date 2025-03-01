import json
from datetime import timedelta
from decimal import Decimal

from django.db.models import QuerySet
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

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
from .utils import create_payment_from_ha, recalculate_balance, update_balance

QRCode_expiration_time = 2  # Durée (en minutes) avant que le QRCode périme


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
def helloasso_payment_webhook(request):
    if request.method == "POST" or request.method == "GET":  # noqa: PLR1714
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
                return JsonResponse(
                    {"error": "Unhandled event type"}, status=400
                )

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    return HttpResponse(status=405)  # Method not allowed


@csrf_exempt
def create_transaction(request):
    if request.method == "POST":
        try:
            # Crée un nouveau QR code
            qr_code = QRCode.objects.create(
                user=request.user,
            )

            # Renvoyer l'ID de la transaction
            return JsonResponse({"qr_code_id": qr_code.id}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "JSON invalide"}, status=400)
    else:
        return JsonResponse({"error": "Méthode non autorisée"}, status=405)


@csrf_exempt
def cash_in_qrcode(request, transaction_id):
    if request.method in ("GET", "POST"):
        # Récupérer l'utilisateur actuellement connecté
        receiver = request.user

        # Récupérer l'instance de QRTransaction avec le transaction_id
        try:
            qr_code = QRCode.objects.get(id=transaction_id)
        except QRCode.DoesNotExist:
            return JsonResponse({"Error": "QR Code not found"}, status=404)

        # Récupérer l'utilisateur à facturer
        sender = qr_code.user

        # Vérifier si le receiver n'est pas déjà défini
        if qr_code.transaction is not None:
            return JsonResponse(
                {"Error": "This QR code has already been cashed in."},
                status=400,
            )

        # Vérifier si la transaction n'est pas périmée
        current_time = (
            timezone.now()
        )  # Utilise la méthode correcte de Django pour obtenir l'heure actuelle
        expiration_time = qr_code.creation_date + timedelta(
            minutes=QRCode_expiration_time
        )
        if current_time > expiration_time:
            return JsonResponse(
                {"Error": "This QR code has expired."},
                status=400,
            )

    if request.method == "GET":
        return redirect(f"/nantralpay/cash-in/{transaction_id}/")

    elif request.method == "POST":
        # Récupérer le montant du paiement
        items = []
        amount = Decimal(0)
        try:
            # Parse le corps de la requête JSON
            data = json.loads(request.body)
            for item in data:
                id = item.get("id")
                quantity = item.get("quantity")

                # Vérification de l'ID
                if not id:
                    return JsonResponse(
                        {"error": "Identifiant produit manquant"}, status=400
                    )
                try:
                    item_object = Item.objects.get(id=id)
                except Item.DoesNotExist:
                    return JsonResponse(
                        {"error": "Identifiant produit invalide"}, status=400
                    )

                # Vérification de la quantité
                if not isinstance(quantity, int) or quantity < 0:
                    return JsonResponse(
                        {"error": "Quantité invalide"}, status=400
                    )

                items.append({"item": item_object, "quantity": quantity})
                amount += item_object.price * quantity

        except json.JSONDecodeError:
            return JsonResponse({"error": "JSON invalide"}, status=400)

        # Vérifier si le solde du sender est suffisant
        if qr_code.user.nantralpay_balance < amount:
            return JsonResponse(
                {"Error": "The sender does not have enough money."},
                status=400,
            )

        # Mettre à jour le solde du receiver et du sender
        update_balance(receiver, amount)
        update_balance(sender, -amount)

        # Créer la transaction
        transaction = Transaction.objects.create(
            receiver=receiver,
            sender=sender,
            amount=amount,
            description=f"Cash-in QR Code {transaction_id}",
        )
        # Créer la vente
        sale = Sale.objects.create(user=sender, transaction=transaction)

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

    return JsonResponse({"error": "Invalid request method"}, status=405)
