from django.db import migrations


"""
Accounts were created without uniforming first name, last name and email to lower case.
Correcting this issue.
"""


def forwards_func(apps, schema_editor):
    # We get the model from the versioned app registry;
    # if we directly import it, it'll be the wrong version
    User = apps.get_registered_model('auth', 'User')
    for user in User.objects.all():
        if user.first_name is not None:
            user.first_name = user.first_name.lower()
        if user.last_name is not None:
            user.last_name = user.last_name.lower()
        if user.email is not None:
            user.email = user.email.lower()
        user.save()


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0001_create_test_account_dev'),
    ]

    operations = [
        migrations.RunPython(forwards_func),
    ]
