import json
from pathlib import Path
from random import randint

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.db import migrations

"""
Accounts were created without uniforming first name, last name and email to lower case.
Correcting this issue.
"""


def create_user(apps, schema_editor):
    User = apps.get_registered_model("account", "User")
    Student = apps.get_registered_model("student", "Student")
    password = make_password("pass")
    with open(Path(__file__).parent / "../fixtures/fixtures.json") as f:
        dummyUsers = json.load(f)
    for user in dummyUsers:
        user = User(password=password, **user)
        user.save()
        student = Student.objects.create(user=user)
        student.save()
        user.student = student
        user.student.promo = randint(2017, 2021)
        user.student.save()
        user.save()


def forwards_func(apps, schema_editor):
    # We get the model from the versioned app registry;
    # if we directly import it, it'll be the wrong version
    User = apps.get_registered_model("account", "User")
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
        ("account", "0001_create_test_account_dev"),
    ]

    operations = [
        migrations.RunPython(forwards_func),
    ]


if settings.DEBUG:
    Migration.operations.append(migrations.RunPython(create_user))
    Migration.dependencies.append(("student", "0003_alter_student_options"))
