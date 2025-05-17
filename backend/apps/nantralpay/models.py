import uuid

from django.contrib.contenttypes.fields import (
    GenericForeignKey,
    GenericRelation,
)
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.account.models import User
from apps.event.models import Event
from apps.group.models import Group
from apps.utils.fields.image_field import CustomImageField


def default_QRcode_expiration_date():
    return timezone.now() + timezone.timedelta(minutes=2)

class QRCode(models.Model):
    """Make a QRCode for a model."""
    uuid = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    expiration_date = models.DateTimeField(default=default_QRcode_expiration_date)
    scanned_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    scanned = models.BooleanField(default=False)

    # Related object
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    class Meta:
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]

    def is_scanned(self):
        return self.scanned_by is not None


class Order(models.Model):
    """Model to represent an order.

    An order is a request to perform a transaction.
    The different types of order are:
      - HelloAsso order to refill the user's balance
      - Purchase of items during an event
      - Both of the previous (pay for an event using directly HelloAsso)
    """
    class OrderStatus(models.TextChoices):
        SAVED = "Saved"  # Order is saved but not yet paid
        PENDING = "Pending"  # Order is pending and waiting for payment
        CANCELED = "Canceled"  # Order has been canceled
        COMPLETED = "Completed"   # Order has been completed
        VALIDATED = "Validated"  # Products have been retrieved
        UNKNOWN = "Unknown"  # Order status is unknown

    valid_status = [OrderStatus.COMPLETED]
    invalid_status = [OrderStatus.SAVED, OrderStatus.PENDING, OrderStatus.CANCELED, OrderStatus.VALIDATED, OrderStatus.UNKNOWN]
    cancelable_status = [OrderStatus.SAVED, OrderStatus.COMPLETED]

    # Generic data
    user = models.ForeignKey(User, on_delete=models.CASCADE, help_text=_("The user who created the order"))
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    creation_date = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, help_text=_("Explain what the order is for"))
    status = models.CharField(choices=OrderStatus.choices, default=OrderStatus.SAVED, max_length=10)

    # HelloAsso specific data
    helloasso_order_id = models.IntegerField(blank=True, null=True)
    checkout_intent_id = models.IntegerField(blank=True, null=True)

    # Sender and receiver
    sender_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_orders", null=True, blank=True)
    sender_group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="sent_orders", null=True, blank=True)

    receiver_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_orders", null=True, blank=True)
    receiver_group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="received_orders", null=True, blank=True)

    @property
    def sender(self) -> Group | User | None:
        if self.sender_user:
            return self.sender_user
        elif self.sender_group:
            return self.sender_group
        else:
            return None

    @sender.setter
    def sender(self, value: Group | User | None):
        if isinstance(value, User):
            self.sender_user = value
            self.sender_group = None
        elif isinstance(value, Group):
            self.sender_group = value
            self.sender_user = None
        elif value is None:
            self.sender_user = None
            self.sender_group = None
        else:
            raise TypeError(_("Sender must be a User or a Group (or `None` if money is sent by HelloAsso)"))

    @property
    def receiver(self) -> Group | User | None:
        if self.receiver_user:
            return self.receiver_user
        elif self.receiver_group:
            return self.receiver_group
        else:
            return None

    @receiver.setter
    def receiver(self, value: Group | User | None):
        if isinstance(value, User):
            self.receiver_user = value
            self.receiver_group = None
        elif isinstance(value, Group):
            self.receiver_group = value
            self.receiver_user = None
        elif value is None:
            self.receiver_user = None
            self.receiver_group = None
        else:
            raise TypeError(_("Receiver must be a User or a Group (or `None` if money taken out)"))

    def clean(self):
        errors = []
        if self.receiver_group and self.receiver_user:
            errors.append(ValidationError(_("Receiver cannot be set for both user and group.")))
        if self.sender_group and self.sender_user:
            errors.append(ValidationError(_("Sender cannot be set for both user and group.")))
        if errors:
            raise ValidationError(errors)


class Transaction(models.Model):
    """Model to represent a transaction.

    A transaction is a transfer of money between two parties.
    The parties are the following:
      - A User
      - A Group
      - HelloAsso with checkout (in this case, sender/receiver is set to null)
    The parties are stored in the associated order.
    """
    update_date = models.DateTimeField(auto_now=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255)

    # HelloAsso specific data
    helloasso_payment_id = models.IntegerField(blank=True, null=True)

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

    order = models.ForeignKey(Order, on_delete=models.CASCADE)  # link the order

    payment_status = models.CharField(
        max_length=255,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING,
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


class Sale(Order):
    qr_codes = GenericRelation(QRCode, related_query_name="sale")

    items = models.ManyToManyField(
        Item, through="Content", related_name="sales"
    )

    event = models.ForeignKey(Event, on_delete=models.CASCADE)

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
    quantity = models.PositiveIntegerField(default=1)

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
    event = models.ForeignKey(
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
