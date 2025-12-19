from django.urls import path

from .views import DepositView, WalletDetailView

app_name = "wallet_api"

urlpatterns = [
    path("me/", WalletDetailView.as_view(), name="wallet-detail"),
    path("deposit/", DepositView.as_view(), name="wallet-deposit"),
]
