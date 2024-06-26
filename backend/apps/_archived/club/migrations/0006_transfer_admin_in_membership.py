# Generated by Django 3.2.3 on 2021-06-16 09:15

import logging

from django.core.exceptions import ObjectDoesNotExist
from django.db import migrations, models

logger = logging.getLogger(__name__)


def forwards_func(apps, schema_editor):
    # We get the model from the versioned app registry;
    # if we directly import it, it'll be the wrong version
    Club = apps.get_model("club", "Club")
    NamedMembershipClub = apps.get_model("club", "NamedMembershipClub")
    db_alias = schema_editor.connection.alias
    clubs = Club.objects.using(db_alias).all()
    for club in clubs:
        for admin in club.admins.all():
            try:
                membership = NamedMembershipClub.objects.using(db_alias).get(
                    club=club,
                    student=admin,
                )
                membership = NamedMembershipClub.objects.get(
                    club=club,
                    student=admin,
                )
                membership.admin = True
                membership.save()
            except ObjectDoesNotExist:
                logger.warning(f"Membership does not exist {club} {admin}")
                NamedMembershipClub.objects.using(db_alias).create(
                    club=club,
                    student=admin,
                    admin=True,
                )


def reverse_func(apps, schema_editor):
    # forwards_func() creates two Country instances,
    # so reverse_func() should delete them.
    Club = apps.get_model("club", "Club")
    NamedMembershipClub = apps.get_model("club", "NamedMembershipClub")
    db_alias = schema_editor.connection.alias
    for membership in NamedMembershipClub.objects.using(db_alias).all():
        if membership.admin:
            club = Club.objects.using(db_alias).get(id=membership.club.id)
            club.admins.add(membership.student)
            club.save()


class Migration(migrations.Migration):
    dependencies = [
        ("club", "0005_auto_20210616_1012"),
    ]

    operations = [
        migrations.AddField(
            model_name="namedmembershipclub",
            name="admin",
            field=models.BooleanField(default=False),
        ),
        migrations.RunPython(forwards_func, reverse_func),
        migrations.RemoveField(
            model_name="club",
            name="admins",
        ),
    ]
