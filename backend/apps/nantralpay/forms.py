from django import forms
from django.core import validators

from ..account.models import User
from .models import Transaction


class RechargeForm(forms.Form):
    amount = forms.DecimalField(
        max_digits=10,
        decimal_places=2,
        label="Amount",
        validators=[
            validators.MinValueValidator(0.01)
        ],  # Amount must be positive and non-zero
    )


class TransactionForm(forms.ModelForm):
    receiver = forms.ModelChoiceField(
        queryset=User.objects.all(),
        label="Recipient",
        widget=forms.Select(attrs={"class": "form-control"}),
    )
    amount = forms.DecimalField(max_digits=10, decimal_places=2, label="Amount")

    class Meta:
        model = Transaction
        fields = ["receiver", "amount", "description"]


class ItemAdminField(forms.ModelChoiceField):
    """Custom field for items in django admin"""

    def label_from_instance(self, obj):
        return obj.name
