# Generated by Django 3.2.3 on 2021-06-19 21:59

from django.db import migrations

import django_ckeditor_5.fields


class Migration(migrations.Migration):
    dependencies = [
        ("post", "0002_use_correct_default_datetime"),
    ]

    operations = [
        migrations.AlterField(
            model_name="post",
            name="description",
            field=django_ckeditor_5.fields.CKEditor5Field(
                blank=True, verbose_name="Texte de l'annonce"
            ),
        ),
    ]
