import json

from django.core.exceptions import (
    ValidationError,
)
from django.db.models import QuerySet
from django.http import JsonResponse
from django.http.response import Http404, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from rest_framework import permissions, viewsets

from apps.group.models import Membership

from .models import (
    Item,
    Payment,
    QRCode,
    Sale,
    Transaction,
)
from .serializers import (
    ItemSerializer,
    PaymentSerializer,
    SaleSerializer,
    TransactionSerializer,
)
from .utils import (
    check_qrcode,
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


class ItemPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        try:
            request.user.student.membership_set.get(
                admin=True, group__slug__in=["bde", "bda", "bds"]
            )
        except Membership.DoesNotExist:
            return request.user.is_superuser
        return True


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
        permissions.IsAuthenticated,
        ItemPermission,
    ]

    def get_queryset(self) -> QuerySet[Item]:
        return Item.objects.all()


@csrf_exempt
@require_http_methods(["POST"])
def create_qrcode(request):
    try:
        # Crée un nouveau QR code
        qr_code = QRCode.objects.create(
            user=request.user,
        )

        # Renvoyer l'ID de la transaction
        return JsonResponse({"qr_code_id": qr_code.id}, status=201)

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON invalide")


@require_http_methods(["GET"])
def qrcode(request, qrcode_id):
    # Récupérer l'instance de QRCode avec le qr_code_uuid
    try:
        qr_code = QRCode.objects.get(id=qrcode_id)
    except QRCode.DoesNotExist:
        return Http404("QR Code not found")

    try:
        check_qrcode(qr_code)
        return JsonResponse(
            {
                "user": str(qr_code.user),
                "balance": qr_code.user.nantralpay_balance,
            }
        )
    except ValidationError as e:
        return HttpResponseBadRequest(" ".join(e))
