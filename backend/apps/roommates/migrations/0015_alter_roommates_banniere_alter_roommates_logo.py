# Generated by Django 4.2.4 on 2023-09-12 18:07

from django.db import migrations

import apps.utils.fields.image_field


class Migration(migrations.Migration):
    dependencies = [
        ("roommates", "0014_alter_roommates_colocathlon_participants"),
    ]

    operations = [
        migrations.AlterField(
            model_name="roommates",
            name="banniere",
            field=apps.utils.fields.image_field.CustomImageField(
                blank=True,
                help_text="Votre bannière sera affichée au format 1320x492 pixels.",
                null=True,
                verbose_name="Bannière",
            ),
        ),
        migrations.AlterField(
            model_name="roommates",
            name="logo",
            field=apps.utils.fields.image_field.CustomImageField(
                blank=True,
                help_text="Votre logo sera affiché au format 306x306 pixels.",
                null=True,
                verbose_name="Logo du groupe",
            ),
        ),
    ]