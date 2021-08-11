# Test clubs will be created for test instances.
from django.conf import settings
from django.db import migrations
from apps.club.models import Club, BDX


def create_clubs(apps, schema_editor):
    bde = BDX.objects.create(
        name='BDE'
    )
    Club.objects.create(
        name='TestClubBDE',
        bdx_type=bde
    )


if settings.DEBUG:
    class Migration(migrations.Migration):

        dependencies = [
            ('club', '0014_auto_20210806_1138'),
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
