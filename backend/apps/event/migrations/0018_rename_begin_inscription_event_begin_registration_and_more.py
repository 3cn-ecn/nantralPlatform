# Generated by Django 4.1.4 on 2023-04-04 17:48
from datetime import timedelta
from django.db import migrations

def add_missing_end_dates(apps, schema_editor) :
    Event = apps.get_model('event', 'Event')
    for obj in Event.objects.all() :
        if (obj.end_date is None):
            obj.end_date = obj.date + timedelta(hours=1)
            obj.save()


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0017_event_updated_at_event_updated_by'),
    ]

    operations = [
        migrations.RenameField(
            model_name='event',
            old_name='begin_inscription',
            new_name='begin_registration',
        ),
        migrations.RenameField(
            model_name='event',
            old_name='end_inscription',
            new_name='end_registration',
        ),
        migrations.RunPython(add_missing_end_dates),
    ]