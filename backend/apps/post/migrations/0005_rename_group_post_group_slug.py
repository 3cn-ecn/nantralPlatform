# Generated by Django 4.1.6 on 2023-02-14 09:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0004_post_notification'),
    ]

    operations = [
        migrations.RenameField(
            model_name='post',
            old_name='group',
            new_name='group_slug',
        ),
    ]