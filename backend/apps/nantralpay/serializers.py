from decimal import Decimal

from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from rest_framework import exceptions, serializers

from apps.account.models import User
from apps.event.models import Event
from apps.nantralpay.models import (
    Content,
    Item,
    Payment,
    Sale,
    Transaction,
)


class TransactionSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        slug_field="student__name", read_only=True
    )

    class Meta:
        model = Transaction
        fields = (
            "id",
            "user",
            "amount",
            "date",
        )


class PaymentSerializer(serializers.ModelSerializer):
    order = serializers.SlugRelatedField(
        slug_field="helloasso_order_id", read_only=True
    )

    class Meta:
        model = Payment
        fields = (
            "id",
            "amount",
            "date",
            "order",
            "helloasso_payment_id",
            "payment_status",
        )


class ItemSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(
        max_digits=10, decimal_places=2, min_value=Decimal("0.01")
    )

    class Meta:
        model = Item
        fields = ("id", "name", "price", "event", "image")

    def validate(self, attrs):
        """Validate the event

        We don't use `validate_event` because it is not a field in the UI.
        """

        data = super().validate(attrs)

        # Get the request User (who send the money)
        user = self.context["request"].user

        event = data.get("event")

        # Check if the user is admin of the event
        if not event.group.is_admin(user):
            raise exceptions.ValidationError(
                _("You have to be admin of the event to add an item")
            )

        # Check if the event can be used with nantralpay
        if not event.use_nantralpay:
            raise exceptions.ValidationError(
                _("This event can't be used with nantralpay")
            )

        # Check if the event can't be modified
        if event.nantralpay_has_been_opened:
            raise exceptions.ValidationError(
                _("This event can't be modified")
            )

        return data


class ContentSerializer(serializers.ModelSerializer):
    quantity = serializers.IntegerField(min_value=Decimal(0))

    class Meta:
        model = Content
        fields = ("id", "quantity", "item")


class SaleSerializer(serializers.ModelSerializer):
    contents = ContentSerializer(many=True)

    class Meta:
        model = Sale
        fields = ("contents", "event")

    def validate_event(self, event):
        if not event.use_nantralpay:
            raise exceptions.ValidationError(
                _("This event can't be used with nantralpay")
            )

    def validate(self, attrs):
        data = super().validate(attrs)

        # Get the request User (who send the money)
        user = self.context["request"].user

        # Check if the user has enough money
        amount = Decimal(0)
        for content in data["contents"]:
            item = content["item"]
            if item.event != data["event"]:
                raise exceptions.ValidationError(
                    _("The selected items are not from the same event")
                )
            quantity = content["quantity"]

            if not quantity:
                continue

            amount += quantity * item.price

        if amount > user.nantralpay_balance:
            raise exceptions.ValidationError(
                _("You don't have enough money to make this transaction")
            )

        if amount == 0:
            raise exceptions.ValidationError("Please select at least one Item")

        # save the amount in the sale (negative because money is taken from the user)
        data["amount"] = -amount

        return data

    def create(self, validated_data):
        # Get the related values
        contents = validated_data.pop("contents")

        # Create the Sale
        sale = Sale.objects.create(
            date=timezone.now(),
            user=self.context["request"].user, **validated_data
        )

        # Create the ItemSales
        Content.objects.bulk_create(
            [
                Content(sale=sale, **item)
                for item in contents
                if item.get("quantity")
            ]
        )

        return sale


class QRCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = ("uuid", "scanned", "seller", "date")


class UserBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "nantralpay_balance")


class NantralPayEventSerializer(serializers.ModelSerializer):
    """Serializer for the NantralPay event"""

    class Meta:
        model = Event
        fields = ("id", "title", "nantralpay_is_open", "use_nantralpay", "nantralpay_has_been_opened")

