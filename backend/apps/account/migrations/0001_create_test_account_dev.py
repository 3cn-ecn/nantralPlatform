import json
from pathlib import Path
from random import randint

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.db import migrations


def create_user(apps, schema_editor):
    User = apps.get_registered_model('auth', 'User')
    Student = apps.get_registered_model('student', 'Student')
    password = make_password("pass")
    with open(Path(__file__).parent / "../fixtures/fixtures.json") as f:
        dummyUsers = json.load(f)
    for user in dummyUsers:
        user = User(
            password=password,
            **user
        )
        user.save()
        student = Student.objects.create(user=user)
        student.save()
        user.student = student
        user.student.promo = randint(2017, 2021)
        user.student.save()
        user.save()


if settings.DEBUG:
    class Migration(migrations.Migration):
        dependencies = [
            ('student', '0003_alter_student_options')
        ]

        operations = [
            migrations.RunPython(create_user),
        ]
else:
    class Migration(migrations.Migration):
        dependencies = [
            ('student', '0003_alter_student_options')
        ]

        operations = [
        ]
