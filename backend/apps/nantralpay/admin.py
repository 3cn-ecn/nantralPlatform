from django.contrib import admin

from .forms import ItemAdminField
from .models import (
    Item,
    ItemSale,
    Order,
    Payment,
    QRCode,
    Sale,
    Transaction,
)


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "order",
        "amount",
        "payment_date",
        "helloasso_payment_id",
    )
    search_fields = ("helloasso_payment_id",)
    list_filter = ("payment_date", "payment_status", "payment_cash_out_state")
    ordering = ("-payment_date",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "amount",
        "checkout_date",
        "helloasso_order_id",
    )
    search_fields = (
        "user",
        "helloasso_order_id",
    )
    list_filter = ("checkout_date",)
    ordering = ("-checkout_date",)


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        "sender",
        "receiver",
        "amount",
        "transaction_date",
        "get_description",
    )
    search_fields = (
        "sender__username",
        "receiver__username",
        "get_description",
    )
    list_filter = ("transaction_date",)
    ordering = ("-transaction_date",)


@admin.register(QRCode)
class QRCodeAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "creation_date",
        "id",
    )
    search_fields = ("user__username",)
    list_filter = ("creation_date",)
    ordering = ("-creation_date",)


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ("name", "price")
    search_fields = ("name",)
    ordering = ("name",)


class ItemSaleInline(admin.TabularInline):
    model = ItemSale
    extra = 1
    min_num = 1

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """Custom option text in the form"""
        if db_field.name == "item":
            return ItemAdminField(queryset=Item.objects.all())
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    inlines = (ItemSaleInline,)
    search_fields = (
        "user__first_name",
        "user__last_name",
        "user__email",
    )
    list_display = ("user", "get_items")
