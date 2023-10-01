# Generated by Django 4.2.4 on 2023-09-17 12:38

import apps.utils.fields.image_field
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("student", "0007_alter_student_faculty"),
    ]

    operations = [
        migrations.AlterField(
            model_name="student",
            name="picture",
            field=apps.utils.fields.image_field.CustomImageField(
                blank=True, null=True, verbose_name="Photo de profil"
            ),
        ),
    ]