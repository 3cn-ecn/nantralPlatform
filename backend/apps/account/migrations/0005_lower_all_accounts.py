from django.db import migrations

"""
Accounts were created without uniforming email to lower case,
when switching from a temporary account to a true account.
Correcting this issue.
"""


def forwards_func(apps, schema_editor):
    # We get the model from the versioned app registry;
    # if we directly import it, it'll be the wrong version
    User = apps.get_registered_model("account", "User")
    for user in User.objects.all():
        if user.email is not None:
            user.email = user.email.lower()
        user.save()


class Migration(migrations.Migration):
    dependencies = [
        ("account", "0004_alter_temporaryaccessrequest_message_id"),
    ]

    operations = [
        migrations.RunPython(forwards_func),
    ]
