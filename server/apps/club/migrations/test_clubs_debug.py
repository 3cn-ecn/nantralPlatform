# Test clubs will be created for test instances.
import os
from django.conf import settings
from django.db import migrations
from apps.club.models import Club, BDX, NamedMembershipClub
import random
import json
from pathlib import Path


def create_clubs(apps, schema_editor):
    bde = BDX(
        name='BDE'
    )
    bde.save()
    bde.refresh_from_db()
    bds = BDX(
        name='BDA'
    )
    bds.save()
    bds.refresh_from_db()
    bda = BDX(
        name='BDS'
    )
    bda.save()
    bda.refresh_from_db()

    with open(Path(__file__).parent / "../fixtures/fixtures.json") as f:
        dummyClubs = json.load(f)

    for club in dummyClubs:
        bdx_id = random.randint(0, 2)
        if(bdx_id == 0):
            bdx_type = bde
        elif (bdx_id == 1):
            bdx_type = bds
        else:
            bdx_type = bda
        newClub = Club.objects.create(
            bdx_type=bdx_type,
            **club
        )
        nbOfNewMembers = random.randint(1, 50)
        for i in range(0, nbOfNewMembers):
            studentID = random.randint(1, 199)
            is_admin = random.random() > 0.9
            NamedMembershipClub.objects.create(
                group=newClub, function="Membre", student_id=studentID, admin=is_admin)


migrations_files = os.listdir('apps/club/migrations')
migrations_files.sort()
migrations_files = [
    migrations_file for migrations_file in migrations_files if migrations_file[0:3].isnumeric()]
latest_migration_file = migrations_files[-1][: -3]


if settings.DEBUG:

    class Migration(migrations.Migration):

        dependencies = [
            ('club', latest_migration_file),
        ]

        operations = [
            migrations.RunPython(create_clubs)
        ]
else:
    class Migration(migrations.Migration):

        dependencies = [
            ('club', latest_migration_file),
        ]

        operations = [
        ]
