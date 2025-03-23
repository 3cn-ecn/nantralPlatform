import uuid

from django.db import models

from apps.account.models import User
from apps.group.models import Group


class Order(models.Model):
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    checkout_intent_id = models.IntegerField(unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    checkout_date = models.DateTimeField(auto_now_add=True)

    helloasso_order_id = models.IntegerField(unique=True, null=True)


class Payment(models.Model):
    class PaymentStatus(models.TextChoices):
        PENDING = "Pending"
        AUTHORIZED = "Authorized"
        REFUSED = "Refused"
        UNKNOWN = "Unknown"
        REGISTERED = "Registered"
        REFUNDED = "Refunded"
        REFUNDING = "Refunding"
        CONTESTED = "Contested"

    valid_payment_status = [
        PaymentStatus.PENDING,  # Pending payments are valid to ensure the users can pay as soon as possible
        PaymentStatus.AUTHORIZED,
        PaymentStatus.REGISTERED,
    ]

    invalid_payment_status = [
        PaymentStatus.REFUSED,
        PaymentStatus.UNKNOWN,
        PaymentStatus.REFUNDED,
        PaymentStatus.REFUNDING,
        PaymentStatus.CONTESTED,
    ]

    class PaymentCashOutState(models.TextChoices):
        CASHED_OUT = "CashedOut"
        WAITING_FOR_CASH_OUT_CONFIRMATION = "WaitingForCashOutConfirmation"
        REFUNDING = "Refunding"
        REFUNDED = "Refunded"
        TRANSFERT_IN_PROGRESS = "TransfertInProgress"
        TRANSFERED = "Transfered"
        MONEY_IN = "MoneyIn"

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    helloasso_payment_id = models.IntegerField(unique=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)

    payment_status = models.CharField(
        max_length=255,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING,
    )

    payment_cash_out_state = models.CharField(
        max_length=255,
        choices=PaymentCashOutState.choices,
        default=PaymentCashOutState.MONEY_IN,
    )


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

    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name="transactions",
        blank=True,
        null=True,
    )


class QRCode(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, editable=False, unique=True, primary_key=True
    )
    user = models.ForeignKey(
        User, related_name="qr_code", on_delete=models.CASCADE
    )
    creation_date = models.DateTimeField(auto_now_add=True)
    transaction = models.OneToOneField(
        Transaction,
        on_delete=models.CASCADE,
        related_name="qr_code",
        blank=True,
        null=True,
    )


class Item(models.Model):
    name = models.CharField(max_length=255, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)


class Sale(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sales"
    )
    items = models.ManyToManyField(
        Item, through="ItemSale", related_name="sales"
    )
    transaction = models.OneToOneField(
        Transaction,
        on_delete=models.CASCADE,
        related_name="sale",
        blank=True,
        null=True,
    )

    def get_price(self):
        return sum(
            item.item.price * item.quantity for item in self.item_sales.all()
        )


class ItemSale(models.Model):
    item = models.ForeignKey(
        Item, on_delete=models.CASCADE, related_name="item_sales"
    )
    sale = models.ForeignKey(
        Sale, on_delete=models.CASCADE, related_name="item_sales"
    )
    quantity = models.IntegerField(default=1)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=("item", "sale"), name="unique_item_sale"
            )
        ]
