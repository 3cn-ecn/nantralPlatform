# Generated by Django 3.0.8 on 2020-09-05 16:24

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("event", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="baseevent",
            name="color",
            field=models.CharField(
                choices=[
                    ("$blue", "Bleu"),
                    ("$indigo", "Indigo"),
                    ("$purple", "Violet"),
                    ("$pink", "Rose"),
                    ("$red", "Orange"),
                    ("$yellow", "Jaune"),
                    ("$green", "Vert"),
                    ("$teal", "Turquoise"),
                    ("$cyan", "Cyan"),
                ],
                max_length=200,
                null=True,
                verbose_name="Couleur de fond",
            ),
        ),
    ]
