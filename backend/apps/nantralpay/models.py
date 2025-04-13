import uuid

from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.account.models import User
from apps.event.models import Event
from apps.utils.fields.image_field import CustomImageField


class Transaction(models.Model):
    date = models.DateTimeField(null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.CharField(max_length=255)


class Order(models.Model):
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    checkout_intent_id = models.IntegerField(unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    checkout_date = models.DateTimeField(auto_now_add=True)

    helloasso_order_id = models.IntegerField(unique=True, null=True)


class Payment(Transaction):
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


class Item(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="items",
        null=True,
        blank=True,
    )

    image = CustomImageField(
        verbose_name=_("Image"),
        null=True,
        blank=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=("name", "event"), name="unique_event_item_name"
            )
        ]
        
    def delete(self, *args, **kwargs):
        self.image.delete(save=False)
        super().delete(*args, **kwargs)




class Sale(Transaction):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    seller = models.ForeignKey(
        "Seller",
        on_delete=models.SET_NULL,
        related_name="sales",
        null=True,
        blank=True,
    )

    items = models.ManyToManyField(
        Item, through="Content", related_name="sales"
    )

    creation_date = models.DateTimeField(auto_now_add=True)

    scanned = models.BooleanField(default=False)

    def get_price(self):
        return sum(
            item.item.price * item.quantity for item in self.contents.all()
        )

    def get_items(self):
        """Shows the purchased items"""
        return " / ".join(
            f"{item.quantity}x {item.item.name}" for item in self.contents.all()
        )


class Content(models.Model):
    item = models.ForeignKey(
        Item, on_delete=models.PROTECT, related_name="used_in_list"
    )
    sale = models.ForeignKey(
        Sale, on_delete=models.CASCADE, related_name="contents"
    )
    quantity = models.IntegerField(default=1)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=("item", "sale"), name="unique_item_sale"
            )
        ]


class Seller(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="seller"
    )
    events = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="seller_list"
    )


class RefreshToken(models.Model):
    token = models.CharField(max_length=255, unique=True)
    creation_date = models.DateTimeField()
    expiration_date = models.DateTimeField()

    is_active = models.BooleanField(default=True)


class AccessToken(models.Model):
    token = models.CharField(max_length=255, unique=True)
    creation_date = models.DateTimeField()
    expiration_date = models.DateTimeField()

    is_active = models.BooleanField(default=True)
