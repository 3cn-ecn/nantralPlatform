from django.contrib.auth.hashers import make_password
from django.db import migrations
from django.conf import settings


def create_user(apps, schema_editor):
    User = apps.get_registered_model('auth', 'User')
    user = User(
        username='user',
        first_name='Robin',
        last_name='Test',
        email='robin@ec-nantes.fr',
        password=make_password('pass'),
        is_superuser=True,
        is_staff=True,
        is_active=True
    )
    user.save()
    Student = apps.get_registered_model('student', 'Student')
    student = Student.objects.create(user=user)
    student.save()
    user.student = student
    user.student.promo = 2017
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
