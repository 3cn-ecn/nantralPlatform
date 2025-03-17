# Generated by Django 4.2.13 on 2024-08-17 10:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("family", "0010_answerfamily_custom_coeff_answermember_custom_coeff_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="basequestion",
            name="allow_custom_coef",
        ),
        migrations.AddField(
            model_name="questionfamily",
            name="allow_custom_coef",
            field=models.BooleanField(
                default=False,
                verbose_name="Coefficient personnalisable par la famille répondant",
            ),
        ),
        migrations.AddField(
            model_name="questionmember",
            name="allow_custom_coef",
            field=models.BooleanField(
                default=False,
                verbose_name="Coefficient personnalisable par la personne répondant",
            ),
        ),
    ]
