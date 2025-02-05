from django.contrib import admin

from .models import Payment, QRTransaction, Transaction


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "amount",
        "payment_date",
        "helloasso_payment_id",
    )
    search_fields = (
        "user__username",
        "helloasso_payment_id",
    )
    list_filter = ("payment_date",)
    ordering = ("-payment_date",)


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        "sender",
        "receiver",
        "amount",
        "transaction_date",
        "description",
    )
    search_fields = (
        "sender__username",
        "receiver__username",
        "description",
    )
    list_filter = ("transaction_date",)
    ordering = ("-transaction_date",)


@admin.register(QRTransaction)
class QRTransactionAdmin(admin.ModelAdmin):
    list_display = (
        "sender",
        "receiver",
        "amount",
        "creation_date",
    )
    search_fields = (
        "sender__username",
        "receiver__username",
    )
    list_filter = ("creation_date",)
    ordering = ("-creation_date",)
