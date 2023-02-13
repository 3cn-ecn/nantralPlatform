# Generated by Django 4.1.4 on 2023-01-23 13:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("event", "0009_baseevent_notification"),
    ]

    operations = [
        migrations.AddField(
            model_name="baseevent",
            name="max_participant",
            field=models.IntegerField(
                blank=True, null=True, verbose_name="Nombre de places maximal"
            ),
        ),
        migrations.AlterField(
            model_name="baseevent",
            name="ticketing",
            field=models.CharField(
                blank=True,
                max_length=200,
                null=True,
                verbose_name="Lien vers la billetterie",
            ),
        ),
    ]