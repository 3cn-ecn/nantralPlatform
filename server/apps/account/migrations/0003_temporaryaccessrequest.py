# Generated by Django 3.2.3 on 2021-08-07 11:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('account', '0002_lower_all_accounts'),
    ]

    operations = [
        migrations.CreateModel(
            name='TemporaryAccessRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('approved_until', models.DateField()),
                ('date', models.DateField()),
                ('message_id', models.IntegerField(blank=True, null=True)),
                ('domain', models.CharField(max_length=64)),
                ('approved', models.BooleanField()),
                ('mail_valid', models.BooleanField()),
                ('final_email', models.EmailField(blank=True, max_length=254, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
