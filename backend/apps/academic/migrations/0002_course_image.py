# Generated by Django 3.0.8 on 2021-01-20 11:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('academic', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='image',
            field=models.CharField(max_length=200, null=True, verbose_name="Image de l'option"),
        ),
    ]