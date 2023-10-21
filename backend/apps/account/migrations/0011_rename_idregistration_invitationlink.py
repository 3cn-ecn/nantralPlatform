# Generated by Django 4.2.5 on 2023-10-21 16:18

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("account", "0010_idregistration_expires_at_user_email_next_and_more"),
    ]

    operations = [
        migrations.RenameModel(
            old_name="IdRegistration",
            new_name="InvitationLink",
        ),
        migrations.AddField(
            model_name="invitationlink",
            name="description",
            field=models.CharField(default="", max_length=200),
        ),
    ]
