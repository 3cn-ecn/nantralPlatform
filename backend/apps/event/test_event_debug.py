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


def createEvents(apps, schema_editor):
    with open(Path(__file__).parent / "../fixtures/fixtures.json") as f:
        dummyEvents = json.load(f)

    for event in dummyEvents:
        clubs = Club.objects.all()[:]
        clubID = random.randint(0, len(clubs))
        randomDate = timezone.now() + timedelta(days=random.randint(1, 20))
        # For some reason, slugs are appended with a '-1'
        # so we have to add it manually or it won't find anything
        newEvent = BaseEvent.objects.create(
            group=f'{clubs[clubID].full_slug}-1',
            date=randomDate,
            **event
        )
        students = Student.objects.all()[:]
        nbOfParticipants = random.randint(1, len(students))
        for id in random.sample(range(0, len(students)), nbOfParticipants):
            newEvent.participants.add(students[id].id)
        newEvent.save()


migrations_files = sorted(os.listdir('apps/event/migrations'))
migrations_files = [
    migrations_file for migrations_file in migrations_files if migrations_file[0:3].isnumeric()]
latest_migration_file = migrations_files[-1][: -3]


if settings.DEBUG:

    class Migration(migrations.Migration):

        dependencies = [
            ('event', latest_migration_file),
        ]

        operations = [
            migrations.RunPython(createEvents)
        ]
else:
    class Migration(migrations.Migration):

        dependencies = [
            ('event', latest_migration_file),
        ]

        operations = [
        ]
