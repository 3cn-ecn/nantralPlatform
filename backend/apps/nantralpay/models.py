import uuid

from django.db import models

from apps.account.models import User


class Transaction(models.Model):
    sender = models.ForeignKey(
        User, related_name="transaction_sender", on_delete=models.CASCADE
    )
    receiver = models.ForeignKey(
        User, related_name="transaction_receiver", on_delete=models.CASCADE
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_date = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)


class Payment(models.Model):
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    helloasso_payment_id = models.CharField(max_length=255)


class QRTransaction(models.Model):
    transaction_id = models.UUIDField(
        default=uuid.uuid4, editable=False, unique=True, primary_key=True
    )
    sender = models.ForeignKey(
        User, related_name="QR_sender", on_delete=models.CASCADE
    )
    receiver = models.ForeignKey(
        User,
        related_name="QR_receiver",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    creation_date = models.DateTimeField(auto_now_add=True)
