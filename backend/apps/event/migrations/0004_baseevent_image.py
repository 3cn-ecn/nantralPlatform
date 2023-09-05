# Generated by Django 3.0.8 on 2020-10-30 22:02

from django.db import migrations, models

import apps.utils.upload


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0003_auto_20201019_1934'),
    ]

    operations = [
        migrations.AddField(
            model_name='baseevent',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=apps.utils.upload.PathAndRename('events/pictures'), verbose_name="Une image, une affiche en lien avec l'evenement ?"),
        ),
    ]
