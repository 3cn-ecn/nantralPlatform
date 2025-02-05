from rest_framework import serializers

from .models import Payment, QRTransaction, Transaction


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
