# Test clubs will be created for test instances.
import os
from django.conf import settings
from django.db import migrations
from apps.club.models import Club, BDX


def create_clubs(apps, schema_editor):
    bde = BDX(
        name='BDE'
    )
    bde.save()
    bde.refresh_from_db()
    Club.objects.create(
        name='TestClubBDE',
        bdx_type=bde
    )


if settings.DEBUG:
    migrations_files = os.listdir('apps/club/migrations')
    migrations_files.sort()
    migrations_files = [
        migrations_file for migrations_file in migrations_files if migrations_file[0:3].isnumeric()]
    latest_migration_file = migrations_files[-1][:-3]

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
            ('club', '0014_auto_20210806_1138'),
        ]

        operations = [
        ]
