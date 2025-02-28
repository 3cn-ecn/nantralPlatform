from django.contrib import admin

from .forms import ItemAdminField
from .models import Item, ItemSale, Payment, QRCode, Sale, Transaction


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

    def get_items(self, obj):
        """Shows the purchased items"""
        return "\n".join(
            f"{item.quantity}x {item.item.name}"
            for item in obj.item_sales.all()
        )
