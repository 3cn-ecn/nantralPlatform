# Generated by Django 3.2.4 on 2021-08-31 11:34

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("group", "0008_compressPreviousImages"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="adminrightsrequest",
            name="issue",
        ),
    ]
