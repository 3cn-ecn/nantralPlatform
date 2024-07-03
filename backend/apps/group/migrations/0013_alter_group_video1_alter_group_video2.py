# Generated by Django 4.2.13 on 2024-05-13 07:13

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("group", "0012_alter_group_banner_alter_group_icon_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="group",
            name="video1",
            field=models.URLField(
                blank=True, default="", verbose_name="Video link 1"
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="group",
            name="video2",
            field=models.URLField(
                blank=True, default="", verbose_name="Video link 2"
            ),
            preserve_default=False,
        ),
    ]
