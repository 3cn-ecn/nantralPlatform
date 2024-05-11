# Generated by Django 4.1.7 on 2023-02-22 11:49

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("academic", "0009_migrate_to_group"),
        ("exchange", "0002_delete_exchange"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="namedmembershipcourse",
            name="group",
        ),
        migrations.RemoveField(
            model_name="namedmembershipcourse",
            name="student",
        ),
        migrations.DeleteModel(
            name="Course",
        ),
        migrations.DeleteModel(
            name="NamedMembershipCourse",
        ),
    ]
