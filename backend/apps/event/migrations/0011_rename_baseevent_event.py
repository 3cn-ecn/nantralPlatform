# Generated by Django 4.1.7 on 2023-02-20 20:37

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("notification", "0003_alter_notification_publicity"),
        ("student", "0006_alter_student_faculty"),
        ("event", "0010_rename_group_baseevent_group_slug_and_more"),
    ]

    operations = [
        migrations.RenameModel(
            old_name="BaseEvent",
            new_name="Event",
        ),
    ]
