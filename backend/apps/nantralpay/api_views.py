from django.db.models import QuerySet
from django.http.request import QueryDict
from django.utils.translation import gettext_lazy as _

from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.account.models import User
from apps.event.models import Event
from apps.group.models import Membership
from apps.nantralpay.models import (
    Item,
    Order,
    Payment,
    Sale,
    Transaction,
)
from apps.nantralpay.serializers import (
    ItemSerializer,
    NantralPayEventSerializer,
    PaymentSerializer,
    QRCodeSerializer,
    SaleSerializer,
    TransactionSerializer,
    UserBalanceSerializer,
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


class NantralPayEventPermission(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_superuser

    def has_object_permission(self, request, view, obj: Event) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.group.is_admin(request.user)


class ItemPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        try:
            request.user.student.membership_set.get(admin=True)
        except Membership.DoesNotExist:
            return request.user.is_superuser
        return True


class OrderViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    """List and retrieve payments of the current user."""

    serializer_class = PaymentSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get_queryset(self) -> QuerySet[Order]:
        return Payment.objects.filter(order__user=self.request.user)


class TransactionViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    """List and retrieve transactions of the current user."""

    serializer_class = TransactionSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get_queryset(self) -> QuerySet[Transaction]:
        return Transaction.objects.filter(user=self.request.user)


class SaleViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """Viewset to handle creation of sales.

    Actions
    -------
    - POST .../nantralpay/sale/: create a sale
    """

    serializer_class = SaleSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get_queryset(self) -> QuerySet[Sale]:
        return Sale.objects.all()


class ItemViewSet(viewsets.ModelViewSet):
    """Viewset to handle items."""

    serializer_class = ItemSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        ItemPermission,
    ]

    @property
    def query_params(self) -> QueryDict:
        return self.request.query_params

    def get_queryset(self) -> QuerySet[Item]:
        if self.query_params.get("event") is None:
            items = Item.objects.all()
        else:
            items = Item.objects.filter(event__pk=self.query_params.get("event"))
        if self.request.method in permissions.SAFE_METHODS:
            return items
        else:
            return items.filter(event__nantralpay_has_been_opened=False)


class CashInViewSet(
    mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet
):
    """Retrieve the QRCode and update the sale."""

    serializer_class = QRCodeSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        NantralPayPermission,
    ]

    def get_queryset(self) -> QuerySet[Sale]:
        return Sale.objects.filter(cash_in_date=None)


class UserBalanceViewSet(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """Retrieve the user balance.

    Actions
    -------
    - GET .../nantralpay/balance/current/: get the balance of the current user
    - GET .../nantralpay/balance/<id>/ : get the balance of a user
    """

    serializer_class = UserBalanceSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get_queryset(self) -> QuerySet[Sale]:
        return User.objects.all()

    def get_object(self):
        pk = self.kwargs.get("pk")

        if pk == "current":
            return self.request.user

        return super().get_object()

class NantralPayEventViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    """Viewset to handle NantralPay events.

    Actions
    -------
    - GET .../nantralpay/event/ : get the list of events
    - GET .../nantralpay/event/<id>/ : get an event
    - POST .../nantralpay/event/<id>/enable/ : enable NantralPay for an event
    - POST .../nantralpay/event/<id>/disable/ : disable NantralPay for an event
    """

    serializer_class = NantralPayEventSerializer

    def get_permissions(self):
        if self.action == "list":
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ("enable", "disable"):
            permission_classes = [NantralPayEventPermission]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self) -> QuerySet[Sale]:
        if self.action == "list":
            return Event.objects.filter(nantralpay_is_open=True)
        return Event.objects.all()

    @action(detail=True, methods=["post"])
    def enable(self, request, pk=None):
        """Enable NantralPay for an event."""
        event = self.get_object()
        if not event.use_nantralpay:
            return Response(
                {"detail": _("NantralPay is not available for this event")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if event.nantralpay_is_open:
            return Response(
                {"detail": _("NantralPay is already open for this event")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        event.nantralpay_has_been_opened = True
        event.nantralpay_is_open = True
        event.save()
        return Response({"detail": _("NantralPay enabled")})

    @action(detail=True, methods=["post"])
    def disable(self, request, pk=None):
        """Disable NantralPay for an event."""
        event = self.get_object()
        if not event.use_nantralpay:
            return Response(
                {"detail": _("NantralPay is not available for this event")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not event.nantralpay_is_open:
            return Response(
                {"detail": _("NantralPay is already closed for this event")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        event.nantralpay_is_open = False
        event.save()
        return Response({"detail": _("NantralPay disabled")})