# Generated by Django 3.2.4 on 2021-10-01 00:58

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('roommates', '0010_auto_20210806_1138'),
    ]

    operations = [
        migrations.AlterField(
            model_name='roommates',
            name='begin_date',
            field=models.DateField(default=datetime.datetime.today, verbose_name="Date d'emménagement"),
        ),
    ]
