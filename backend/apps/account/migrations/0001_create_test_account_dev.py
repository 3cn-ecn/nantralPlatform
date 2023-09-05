from django.contrib.auth.hashers import make_password
from django.db import migrations
from django.conf import settings
from random import randint
import json
from pathlib import Path
import django
from django.db import models
from django.contrib.auth import get_user_model


def create_user(apps, schema_editor):
    User = get_user_model()
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


# migration for custom user table
user_migration = migrations.CreateModel(
    name='User',
    fields=[
        ('id', models.AutoField(auto_created=True,
                                primary_key=True, serialize=False, verbose_name='ID')),
        ('password', models.CharField(
            max_length=128, verbose_name='password')),
        ('last_login', models.DateTimeField(
            blank=True, null=True, verbose_name='last login')),
        ('is_superuser', models.BooleanField(default=False,
                                             help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
        ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.',
                                      max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
        ('first_name', models.CharField(blank=True,
                                        max_length=150, verbose_name='first name')),
        ('last_name', models.CharField(blank=True,
                                       max_length=150, verbose_name='last name')),
        ('email', models.EmailField(blank=True,
                                    max_length=254, verbose_name='email address')),
        ('is_staff', models.BooleanField(default=False,
                                         help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
        ('is_active', models.BooleanField(
            default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
        ('date_joined', models.DateTimeField(
            default=django.utils.timezone.now, verbose_name='date joined')),
        ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
                                          related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
        ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.',
                                                    related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
    ],
    options={
        'db_table': 'auth_user',
    },
    managers=[
        ('objects', django.contrib.auth.models.UserManager()),
    ],
)


if settings.DEBUG:
    class Migration(migrations.Migration):
        dependencies = [
            ('auth', '0012_alter_user_first_name_max_length'),
            ('student', '0003_alter_student_options'),
        ]

        operations = [
            migrations.RunPython(create_user),
            user_migration
        ]
else:
    class Migration(migrations.Migration):
        dependencies = [
            ('student', '0003_alter_student_options'),
            ('auth', '0012_alter_user_first_name_max_length'),
        ]

        operations = [user_migration]
