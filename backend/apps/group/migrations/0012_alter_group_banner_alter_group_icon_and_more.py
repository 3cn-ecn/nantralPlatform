# Generated by Django 4.2.4 on 2023-09-12 18:07

import apps.utils.fields.image_field
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("group", "0011_group_can_pin"),
    ]

    operations = [
        migrations.AlterField(
            model_name="group",
            name="banner",
            field=apps.utils.fields.image_field.CustomImageField(
                blank=True,
                help_text="Your banner will be displayed at 1320x492 pixels.",
                null=True,
                upload_to=apps.utils.fields.image_field.CustomImageField.create_filename,
                verbose_name="Banner",
            ),
        ),
        migrations.AlterField(
            model_name="group",
            name="icon",
            field=apps.utils.fields.image_field.CustomImageField(
                blank=True,
                help_text="Your icon will be displayed at 306x306 pixels.",
                null=True,
                upload_to=apps.utils.fields.image_field.CustomImageField.create_filename,
                verbose_name="Icon",
            ),
        ),
        migrations.AlterField(
            model_name="grouptype",
            name="icon",
            field=apps.utils.fields.image_field.CustomImageField(
                blank=True,
                null=True,
                upload_to=apps.utils.fields.image_field.CustomImageField.create_filename,
                verbose_name="Icon",
            ),
        ),
    ]
