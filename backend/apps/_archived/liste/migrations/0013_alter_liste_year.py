# Generated by Django 3.2.4 on 2021-08-19 21:43

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("liste", "0012_auto_20210806_1138"),
    ]

    operations = [
        migrations.AlterField(
            model_name="liste",
            name="year",
            field=models.IntegerField(
                default=2021,
                verbose_name="Année de la liste",
            ),
            preserve_default=False,
        ),
    ]
