# Generated by Django 4.1.4 on 2023-03-18 19:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0015_event_group_alter_event_form_url_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='max_participant',
            field=models.PositiveIntegerField(blank=True, null=True, verbose_name='Nombre de places maximum'),
        ),
    ]