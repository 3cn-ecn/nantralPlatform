from django.conf import settings
from django.db import models


# table wallet
class Wallet(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="wallet",
    )
    balance = models.DecimalField(max_digits=6, decimal_places=2, default=0)

    def __str__(self):
        return f"Wallet of {self.user.username}"


# table transaction
class Transaction(models.Model):
    DEPOSIT = "DEPOSIT"
    WITHDRAW = "WITHDRAW"

    TRANSACTION_TYPES = [
        (DEPOSIT, "Deposit"),
        (WITHDRAW, "Withdraw"),
    ]

    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=6, decimal_places=2)
    transaction_type = models.CharField(
        max_length=10, choices=TRANSACTION_TYPES
    )
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default="SUCCESS")

    def __str__(self):
        return f"{self.transaction_type} - {self.amount}€"


# Create your models here.
