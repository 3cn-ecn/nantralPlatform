# Generated by Django 4.1.7 on 2023-02-22 11:49

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("liste", "0015_migrate_to_group"),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name="namedmembershiplist",
            unique_together=None,
        ),
        migrations.RemoveField(
            model_name="namedmembershiplist",
            name="group",
        ),
        migrations.RemoveField(
            model_name="namedmembershiplist",
            name="student",
        ),
        migrations.DeleteModel(
            name="Liste",
        ),
        migrations.DeleteModel(
            name="NamedMembershipList",
        ),
    ]
