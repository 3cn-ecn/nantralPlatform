import json
from datetime import timedelta

from django.db.models import QuerySet
from django.http import HttpResponse, JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from rest_framework import permissions, viewsets

from .datawebhook import DATA
from .models import Payment, QRTransaction, Transaction
from .serializers import (
    PaymentSerializer,
    QRTransactionSerializer,
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
    serializer_class = QRTransactionSerializer
    permission_classes = [permissions.IsAuthenticated, NantralPayPermission]

    def get_queryset(self) -> QuerySet[Payment]:
        return QRTransaction.objects.all()


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
            # Parse le corps de la requête JSON
            data = json.loads(request.body)
            montant = data.get("amount")

            if not montant:
                return JsonResponse({"error": "Montant manquant"}, status=400)

            if not request.user.nantralpay_balance >= montant:
                return JsonResponse({"error": "Solde insuffisant"}, status=400)

            # Crée une nouvelle transaction avec le montant
            transaction = QRTransaction.objects.create(
                amount=montant,
                sender=request.user,
            )

            # Renvoyer l'ID de la transaction
            return JsonResponse(
                {"transaction_id": transaction.transaction_id}, status=201
            )

        except json.JSONDecodeError:
            return JsonResponse({"error": "JSON invalide"}, status=400)
    else:
        return JsonResponse({"error": "Méthode non autorisée"}, status=405)


def cash_in_qrcode(request, transaction_id):
    if request.method == "GET":
        # Récupérer l'utilisateur actuellement connecté
        receiver = request.user

        # Récupérer l'instance de QRTransaction avec le transaction_id
        try:
            qr_transaction = QRTransaction.objects.get(
                transaction_id=transaction_id
            )
        except QRTransaction.DoesNotExist:
            return JsonResponse({"Error": "Transaction not found"}, status=404)

        # Vérifier si le receiver n'est pas déjà défini
        if qr_transaction.receiver is not None:
            return JsonResponse(
                {"Error": "This QR code has already been cashed in."},
                status=400,
            )

        # Vérifier si la transaction n'est pas périmée
        current_time = (
            timezone.now()
        )  # Utilise la méthode correcte de Django pour obtenir l'heure actuelle
        expiration_time = qr_transaction.creation_date + timedelta(
            minutes=QRCode_expiration_time
        )
        if current_time > expiration_time:
            return JsonResponse(
                {"Error": "This QR code has expired."},
                status=400,
            )

        # Vérifier si le solde du sender est suffisant
        if not qr_transaction.sender.nantralpay_balance > qr_transaction.amount:
            return JsonResponse(
                {"Error": "The sender does not have enough money."},
                status=400,
            )

        # Mettre à jour le solde du receiver et du sender
        update_balance(receiver, qr_transaction.amount)
        update_balance(qr_transaction.sender, -qr_transaction.amount)

        # Mettre à jour le receiver et sauvegarder
        qr_transaction.receiver = receiver
        qr_transaction.save()

        return JsonResponse(
            {
                "success": "Receiver added to the QR transaction",
                "transaction_id": str(qr_transaction.transaction_id),
            }
        )

    return JsonResponse({"error": "Invalid request method"}, status=405)
