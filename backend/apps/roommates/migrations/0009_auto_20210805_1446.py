# Generated by Django 3.2.4 on 2021-08-05 12:46

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("roommates", "0008_auto_20210703_0000"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="roommates",
            options={"verbose_name": "coloc"},
        ),
        migrations.AddField(
            model_name="roommates",
            name="banniere",
            field=models.ImageField(
                blank=True,
                help_text="Votre photo sera affichée au format 1320x492 pixels.",
                null=True,
                upload_to="groups/banniere/roommates",
                verbose_name="Photo",
            ),
        ),
        migrations.AlterField(
            model_name="housing",
            name="address",
            field=models.CharField(max_length=250, verbose_name="Adresse"),
        ),
        migrations.AlterField(
            model_name="housing",
            name="details",
            field=models.CharField(
                blank=True,
                max_length=100,
                null=True,
                verbose_name="Complément d'adresse",
            ),
        ),
        migrations.AlterField(
            model_name="namedmembershiproommates",
            name="group",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                to="roommates.roommates",
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="roommates",
            name="name",
            field=models.CharField(
                max_length=100,
                verbose_name="Nom du groupe",
            ),
        ),
    ]
