from decimal import Decimal

from django.utils.translation import gettext_lazy as _

from rest_framework import exceptions, serializers
from rest_framework.settings import api_settings

from apps.account.models import User
from apps.event.models import Event
from apps.nantralpay.models import (
    Content,
    Item,
    Order,
    QRCode,
    Sale,
    Transaction,
)


class ServiceUnavailable(exceptions.APIException):
    status_code = 503
    default_detail = "Service temporarily unavailable, try again later."
    default_code = "service_unavailable"

class TransactionSerializer(serializers.ModelSerializer):
    order = serializers.SlugRelatedField(
        slug_field="id", read_only=True
    )

    class Meta:
        model = Transaction
        fields = (
            "id",
            "amount",
            "update_date",
            "order",
            "helloasso_payment_id",
            "payment_status",
            "description",
        )


class OrderSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    receiver = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = (
            "id",
            "amount",
            "creation_date",
            "sender",
            "receiver",
            "helloasso_order_id",
            "status",
            "description",
        )

    def get_sender(self, obj):
        if obj.sender_user:
            return obj.sender_user.student.name
        elif obj.sender_group:
            return obj.sender_group.name
        else:
            return "<Payment HelloAsso>"

    def get_receiver(self, obj):
        if obj.receiver_user:
            return obj.receiver_user.student.name
        elif obj.receiver_group:
            return obj.receiver_group.name
        else:
            return "<Remboursement>"


class ItemSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(
        max_digits=10, decimal_places=2, min_value=Decimal("0.01")
    )

    class Meta:
        model = Item
        fields = ("id", "name", "price", "event", "image")

    def validate(self, attrs):
        """Validate the event

        We don't use `validate_event` because it is not a field in the UI.
        """

        data = super().validate(attrs)

        # Get the request User (who send the money)
        user = self.context["request"].user

        event = data.get("event")

        # Check if the user is admin of the event
        if not event.group.is_admin(user):
            raise exceptions.ValidationError(
                _("You have to be admin of the event to add an item")
            )

        # Check if the event can be used with nantralpay
        if not event.use_nantralpay:
            raise exceptions.ValidationError(
                _("This event can't be used with nantralpay")
            )

        # Check if the event can't be modified
        if event.nantralpay_has_been_opened:
            raise exceptions.ValidationError(
                _("This event can't be modified")
            )

        return data


class ContentSerializer(serializers.ModelSerializer):
    quantity = serializers.IntegerField(min_value=Decimal(0))

    class Meta:
        model = Content
        fields = ("id", "quantity", "item")


class SaleSerializer(serializers.ModelSerializer):
    contents = ContentSerializer(many=True)
    event = serializers.SlugRelatedField("id", queryset=Event.objects.all())

    class Meta:
        model = Sale
        fields = ("id", "contents", "event")

    def validate_event(self, event):
        errors = []
        if not event.use_nantralpay:
            errors.append(exceptions.ValidationError(
                _("This event can't be used with nantralpay")
            ))
        if not event.nantralpay_is_open:
            errors.append(exceptions.ValidationError(_("This is not a currently opened event")))
        if errors:
            raise exceptions.ValidationError(errors)
        return event

    def validate(self, attrs):
        data = super().validate(attrs)

        # Get the request User (who send the money)
        user = self.context["request"].user
        print(attrs)

        # Check if the user has enough money
        amount = Decimal(0)
        for content in data["contents"]:
            item = content["item"]
            if item.event != data["event"]:
                raise exceptions.ValidationError(
                    _("The selected items are not from the same event")
                )
            quantity = content["quantity"]

            if not quantity:
                continue

            amount += quantity * item.price

        if amount > user.nantralpay_balance:
            raise exceptions.ValidationError(
                _("You don't have enough money to make this transaction")
            )

        if amount == 0:
            raise exceptions.ValidationError("Please select at least one Item")

        # save the amount in the sale (negative because money is taken from the user)
        data["amount"] = amount

        return data

    def create(self, validated_data):
        # Get the related values
        contents = validated_data.pop("contents")
        event = validated_data.pop("event")

        # Create the Sale
        sale = Sale.objects.create(
            event=event,
            user=self.context["request"].user,
            sender_user=self.context["request"].user,
            receiver_group=event.group,
            **validated_data,
        )

        # Create the ItemSales
        Content.objects.bulk_create(
            [
                Content(sale=sale, **item)
                for item in contents
                if item.get("quantity")
            ]
        )

        # Update description now to have infos about the content
        sale.description = f"Vente NantralPay n°{sale.id} ({sale.get_items()})"
        sale.save()

        return sale


class QRCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = QRCode
        fields = ("uuid", "expiration_date", "object_id")


class UserBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "nantralpay_balance")


class NantralPayEventSerializer(serializers.ModelSerializer):
    """Serializer for the NantralPay event"""

    class Meta:
        model = Event
        fields = ("id", "title", "nantralpay_is_open", "use_nantralpay", "nantralpay_has_been_opened")

class SaleDetailSerializer(serializers.ModelSerializer):
    """Serializer for the Sale detail"""

    contents = ContentSerializer(many=True)

    class Meta:
        model = Sale
        fields = ("id", "contents", "date", "amount", "event")

class RefillSerializer(serializers.ModelSerializer):
    """Serializer for the Refill"""

    class Meta:
        model = Order
        fields = ["id", "amount", "helloasso_order_id"]

    def create(self, validated_data):
        request = self.context.get("request")
        amount = validated_data.get("amount")
        """

        body = {
            "totalAmount": int(amount.shift(2)),
            "initialAmount": int(amount.shift(2)),
            "itemName": "Recharge du compte NantralPay",
            "backUrl": reverse(
                "nantralpay:ha_create_payment"
            ),  # à faire: garder le montant demandé dans le formulaire
            "errorUrl": reverse("nantralpay:ha_errorurl"),
            "returnUrl": reverse("nantralpay:ha_successurl"),
            "containsDonation": True,
            "payer": {
                "firstName": request.user.first_name,
                "lastName": request.user.last_name,
                "email": request.user.email,
            },
        }
        try:
            headers = {
                "accept": "application/json",
                "content-type": "application/*+json",
                "authorization": f"Bearer {get_token()}",
            }
        except Exception:
            raise ServiceUnavailable("No token provided")

        from apps.nantralpay.helloasso_checkout_views import HELLOASSO_ORG_SLUG
        response = requests.post(
            f"https://api.helloasso.com/v5/organizations/{HELLOASSO_ORG_SLUG}/checkout-intents",
            json=body,
            headers=headers,
            timeout=60,
        )
        if not response.ok:
            raise ServiceUnavailable("Failed to create payment")

        # Parse response JSON
        try:
            response_data = response.json()
        except json.JSONDecodeError:
            raise exceptions.APIException("Failed to decode response JSON", code=500)

        intent_id = response_data["id"]
        redirect_url = response_data["redirectUrl"]

        # Create a new Order
        Order.objects.create(
            user=request.user,
            checkout_intent_id=intent_id,
            amount=amount,
        )

        order = Order.objects.create(
            user=self.context["request"].user,
            desciption="Refill account",
            checkout_intent_id=intent_id,
            amount=amount,
        )"""

        self.data[api_settings.URL_FIELD_NAME] = "https://api.nantralpay.com"
        obj = Order.objects.create(user=self.context["request"].user, **self.data)
        obj.receiver = self.context["request"].user
        obj.save()
        return obj