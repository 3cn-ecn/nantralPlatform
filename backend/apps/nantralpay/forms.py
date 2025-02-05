from django import forms

from ..account.models import User
from .models import Transaction


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
