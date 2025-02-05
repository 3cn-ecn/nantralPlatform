from ..account.models import User
from .models import Payment, Transaction


def create_payment_from_ha(item, payment_date):
    """Create a payment object from JSON data coming from HelloAsso and return the user associated"""

    amount = item.get("amount")
    payer_email = item.get("customFields")[0]["answer"]
    helloasso_payment_id = item.get("id")

    # check account exists
    try:
        user = User.objects.get(email=payer_email)
        Payment.objects.create(
            user=user,
            amount=amount,
            payment_date=payment_date,
            helloasso_payment_id=helloasso_payment_id,
        )

        return user
    except User.DoesNotExist:
        Payment.objects.create(
            amount=amount,
            payment_date=payment_date,
            helloasso_payment_id=helloasso_payment_id,
        )


def update_balance(user: User, amount: int):
    """Update the balance by adding the amount to the previous user's balance
    Pretty quick"""
    user.nantralpay_balance += amount
    user.save()
    print(f"Done for {user.email}")


def recalculate_balance(user: User):
    """Recalculate the user's balance by taking all the payments and transactions in account.
    It takes time"""
    balance = 0
    for payment in Payment.objects.filter(user=user).values("amount"):
        balance += payment["amount"]

    for transaction in Transaction.objects.filter(receiver=user).values(
        "amount"
    ):
        balance += transaction["amount"]

    for transaction in Transaction.objects.filter(sender=user).values("amount"):
        balance -= transaction["amount"]

    user.nantralpay_balance = balance
    user.save()
    print(f"Done for {user.email}")
