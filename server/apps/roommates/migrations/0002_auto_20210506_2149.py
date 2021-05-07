# Generated by Django 3.0.14 on 2021-05-06 21:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0002_rename_dd_cursus_add_alternant'),
        ('roommates', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='roommates',
            name='members',
            field=models.ManyToManyField(blank=True, through='roommates.NamedMembershipRoommates', to='student.Student'),
        ),
    ]
