from django.contrib import admin

from .forms import ItemAdminField
from .models import (
    Content,
    Item,
    Order,
    Payment,
    Sale,
)


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "order",
        "amount",
        "date",
        "helloasso_payment_id",
    )
    search_fields = ("helloasso_payment_id",)
    list_filter = ("date", "payment_status", "payment_cash_out_state")
    ordering = ("-date",)


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


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "event",
        "price",
    )
    search_fields = ("name", "event")
    list_filter = ("event",)
    ordering = (
        "event",
        "name",
    )


class ContentInline(admin.TabularInline):
    model = Content
    extra = 1
    min_num = 1

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """Custom option text in the form"""
        if db_field.name == "item":
            return ItemAdminField(queryset=Item.objects.all())
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    inlines = (ContentInline,)
    search_fields = (
        "user__first_name",
        "user__last_name",
        "user__email",
    )
    list_display = ("user", "get_items")
