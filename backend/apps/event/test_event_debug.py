# Test events will be created for test instances.
import os
from django.conf import settings
from django.db import migrations
from apps.event.models import BaseEvent
from apps.club.models import Club
from apps.student.models import Student
import random
import json
from pathlib import Path
from datetime import timedelta
from django.utils import timezone


def create_events(apps, schema_editor):
    with open(Path(__file__).parent / "../fixtures/fixtures.json") as f:
        dummy_events = json.load(f)

    for event in dummy_events:
        clubs = Club.objects.all()[:]
        club_id = random.randint(0, len(clubs))
        random_date = timezone.now() + timedelta(days=random.randint(1, 20))
        # For some reason, slugs are appended with a '-1'
        # so we have to add it manually or it won't find anything
        new_event = BaseEvent.objects.create(
            group_slug=f'{clubs[club_id].full_slug}-1',
            date=random_date,
            **event
        )
        students = Student.objects.all()[:]
        nb_participants = random.randint(1, len(students))
        for id in random.sample(range(0, len(students)), nb_participants):
            new_event.participants.add(students[id].id)
        new_event.save()


migrations_files = sorted(os.listdir('apps/event/migrations'))
migrations_files = [
    migrations_file
    for migrations_file in migrations_files
    if migrations_file[0:3].isnumeric()]
latest_migration_file = migrations_files[-1][: -3]


if settings.DEBUG:

    class Migration(migrations.Migration):

        dependencies = [
            ('event', latest_migration_file),
        ]

        operations = [
            migrations.RunPython(create_events)
        ]
else:
    class Migration(migrations.Migration):

        dependencies = [
            ('event', latest_migration_file),
        ]

        operations = [
        ]
