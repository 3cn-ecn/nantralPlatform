from django.contrib.auth.hashers import make_password
from django.db import migrations
from django.conf import settings
from apps.account.fixtures.fixture import dummyUsers
from random import randint


def create_user(apps, schema_editor):
    User = apps.get_registered_model('auth', 'User')
    Student = apps.get_registered_model('student', 'Student')
    password = make_password("pass")
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
