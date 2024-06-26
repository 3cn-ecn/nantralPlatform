# Generated by Django 4.2.9 on 2024-01-23 08:55

from django.db import migrations, models


def add_end_date(apps, schema_editor):
    Roommates = apps.get_model("roommates", "Roommates")
    for roommate in Roommates.objects.filter(end_date__isnull=True):
        roommate.end_date = roommate.begin_date.replace(
            year=roommate.begin_date.year + 1,
        )
        roommate.save()


class Migration(migrations.Migration):
    dependencies = [
        ("roommates", "0015_alter_roommates_banniere_alter_roommates_logo"),
    ]

    operations = [
        migrations.RunPython(
            add_end_date,
            reverse_code=migrations.RunPython.noop,
        ),
        migrations.AlterField(
            model_name="roommates",
            name="end_date",
            field=models.DateField(verbose_name="Date de sortie"),
        ),
    ]
