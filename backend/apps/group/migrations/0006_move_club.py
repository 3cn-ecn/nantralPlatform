# Generated by Django 3.2.3 on 2021-06-12 21:40

from django.db import migrations


class Migration(migrations.Migration):
    atomic = False
    dependencies = [
        ("group", "0005_move_liste"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            state_operations=[
                migrations.AlterUniqueTogether(
                    name="namedmembershipclub",
                    unique_together=None,
                ),
                migrations.RemoveField(
                    model_name="namedmembershipclub",
                    name="club",
                ),
                migrations.RemoveField(
                    model_name="namedmembershipclub",
                    name="student",
                ),
            ],
            database_operations=[],
        ),
        migrations.SeparateDatabaseAndState(
            state_operations=[
                migrations.DeleteModel(
                    name="Club",
                ),
                migrations.DeleteModel(
                    name="NamedMembershipClub",
                ),
            ],
            database_operations=[
                migrations.AlterModelTable(name="Club", table="club_club"),
                migrations.AlterModelTable(
                    name="NamedMembershipClub", table="club_namedmembershipclub"
                ),
            ],
        ),
    ]
