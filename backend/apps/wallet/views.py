from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Transaction, Wallet
from .serializers import DepositSerializer, WalletSerializer


class WalletDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        serializer = WalletSerializer(wallet)
        return Response(serializer.data)


class DepositView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        serializer = DepositSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        amount = serializer._validated_data["amount"]

        wallet.balance += amount
        wallet.save()

        # TODO: En pratique, il faudrait ajouter @transaction.atomic
        # pour éviter que le solde augmente sans créer de trace de transaction

        Transaction.objects.create(
            wallet=wallet, amount=amount, transaction_type=Transaction.DEPOSIT
        )

        return Response(
            {
                "message": "Dépôt effectué avec succès",
                "new_balance": wallet.balance,
            }
        )


# Create your views here.
