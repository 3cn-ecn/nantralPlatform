# Generated by Django 3.2.4 on 2021-08-05 12:46

import django.db.models.expressions
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("club", "0011_auto_20210714_1915"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="club",
            options={
                "ordering": [
                    django.db.models.expressions.OrderBy(
                        django.db.models.expressions.F("bdx_type"),
                        nulls_first=True,
                    ),
                    "name",
                ],
                "verbose_name": "club/asso",
                "verbose_name_plural": "clubs & assos",
            },
        ),
    ]
