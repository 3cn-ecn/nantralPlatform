# Generated by Django 4.2.13 on 2025-02-24 13:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("nantralpay", "0004_item_itemsale_sale_itemsale_sale_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="QRCode",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                        unique=True,
                    ),
                ),
                ("creation_date", models.DateTimeField(auto_now_add=True)),
                (
                    "transaction",
                    models.OneToOneField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="qr_code",
                        to="nantralpay.transaction",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="qr_code",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="sale",
            name="transaction",
            field=models.OneToOneField(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="sale",
                to="nantralpay.transaction",
            ),
        ),
        migrations.DeleteModel(
            name="QRTransaction",
        ),
    ]
