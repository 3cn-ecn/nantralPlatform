# Generated by Django 4.1.7 on 2023-02-22 21:39

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("notification", "0003_alter_notification_publicity"),
        ("academic", "0009_migrate_to_group"),
        ("administration", "0002_migrate_to_group"),
        ("club", "0002_migrate_to_group"),
        ("liste", "0015_migrate_to_group"),
    ]

    operations = [
        migrations.DeleteModel(
            name="Subscription",
        ),
    ]
