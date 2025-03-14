from decimal import Decimal

from rest_framework import exceptions, serializers

from apps.nantralpay.utils import check_qrcode, get_user_group, update_balance

from .models import (
    Item,
    ItemSale,
    Payment,
    Sale,
    Transaction,
)


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ("id", "qr_code")


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ("id", "name", "price")


def positive(val):
    if val < 0:
        raise serializers.ValidationError(
            "This value should be positive or zero"
        )


class ItemSaleSerializer(serializers.ModelSerializer):
    quantity = serializers.IntegerField(validators=[positive])

    class Meta:
        model = ItemSale
        fields = ("id", "quantity", "item")


class SaleSerializer(serializers.ModelSerializer):
    transaction = TransactionSerializer()
    item_sales = ItemSaleSerializer(many=True)

    class Meta:
        model = Sale
        fields = ("id", "item_sales", "transaction")

    def validate(self, attrs):
        data = super().validate(attrs)

        # Check if the QR code is valid
        check_qrcode(data["transaction"]["qr_code"])

        # Get the request User
        receiver = self.context["request"].user
        # Get the group of the user. Raises an error if the user is not authorized to use NantralPay
        try:
            group = get_user_group(receiver)
        except PermissionError as e:
            raise exceptions.ValidationError(e)

        # Check if the user has enough money
        amount = Decimal(0)
        for item_sale in data["item_sales"]:
            item = item_sale["item"]
            quantity = item_sale["quantity"]

            if not quantity:
                continue

            amount += quantity * item.price
        if amount > receiver.nantralpay_balance:
            raise exceptions.ValidationError(
                "The user does not have enough money"
            )

        if amount == 0:
            raise exceptions.ValidationError("Please select at least one Item")

        # Update the transaction with extra data
        data["transaction"]["receiver"] = receiver
        data["transaction"]["group"] = group
        data["transaction"]["amount"] = amount

        return data

    def create(self, validated_data):
        # Get the related values
        item_sales = validated_data.pop("item_sales")
        transaction_data = validated_data.pop("transaction")
        qr_code = transaction_data.get("qr_code")

        # Create the transaction
        transaction = Transaction(
            sender=qr_code.user,
            description=f"Cash-in QR code {qr_code.id}",
            **transaction_data,
        )
        transaction.save()

        # Create the Sale
        sale = Sale.objects.create(
            user=qr_code.user, transaction=transaction, **validated_data
        )

        # Create the ItemSales
        ItemSale.objects.bulk_create(
            [
                ItemSale(sale=sale, **item)
                for item in item_sales
                if item.get("quantity")
            ]
        )
        # Update the balances
        update_balance(transaction_data["group"], transaction_data["amount"])
        update_balance(qr_code.user, -transaction_data["amount"])

        return sale
