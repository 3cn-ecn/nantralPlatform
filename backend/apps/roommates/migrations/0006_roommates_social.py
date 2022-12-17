# Generated by Django 3.2.3 on 2021-06-18 15:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sociallink', '0002_sociallink_slug'),
        ('roommates', '0005_auto_20210616_2326'),
    ]

    operations = [
        migrations.AddField(
            model_name='roommates',
            name='social',
            field=models.ManyToManyField(blank=True, null=True, to='sociallink.SocialLink'),
        ),
    ]