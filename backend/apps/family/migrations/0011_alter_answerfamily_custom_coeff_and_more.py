# Generated by Django 4.2.13 on 2024-08-01 12:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("family", "0010_answerfamily_custom_coeff_answermember_custom_coeff"),
    ]

    operations = [
        migrations.AlterField(
            model_name="answerfamily",
            name="custom_coeff",
            field=models.FloatField(default=0.5),
        ),
        migrations.AlterField(
            model_name="answermember",
            name="custom_coeff",
            field=models.FloatField(default=0.5),
        ),
    ]
