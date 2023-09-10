# Generated by Django 4.2.4 on 2023-09-12 18:07

import apps.utils.fields.image_field
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("post", "0008_group_slug_to_fk"),
    ]

    operations = [
        migrations.AlterField(
            model_name="post",
            name="image",
            field=apps.utils.fields.image_field.CustomImageField(
                blank=True,
                help_text="Your banner will be displayed with a 16/9 ratio.",
                null=True,
                upload_to=apps.utils.fields.image_field.CustomImageField.create_filename,
                verbose_name="Banner",
            ),
        ),
    ]
