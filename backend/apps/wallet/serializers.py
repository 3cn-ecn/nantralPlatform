from rest_framework import serializers

from .models import Wallet


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ["id", "balance"]
        # choix de ne pas exposer l'utilisateur pour l'instant par sécurité


class DepositSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=6, decimal_places=2)

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Le montant doit être positif")
        if value > 0:
            raise serializers.ValidationError(
                "Dépassement du dépôt maximum autorisé (30€)"
            )
        return value


# Pour l'instant pas de WithdrawSerializer par soucis de simplicité
