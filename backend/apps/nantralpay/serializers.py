from rest_framework import serializers

from .models import (
    Item,
    ItemSale,
    Payment,
    QRTransaction,
    Sale,
    Transaction,
)


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = "__all__"


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"


class QRTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QRTransaction
        fields = "__all__"


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ("id", "name", "price")


class ItemSaleSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)

    class Meta:
        model = ItemSale
        fields = ("id", "quantity", "item")


class ShortItemSaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemSale
        fields = "__all__"


class SaleSerializer(serializers.ModelSerializer):
    item_sales = ItemSaleSerializer(many=True, read_only=True)

    class Meta:
        model = Sale
        fields = ("id", "user", "item_sales")


class ShortSaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = "__all__"
