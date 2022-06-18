# Generated by Django 3.2.12 on 2022-04-19 18:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('notification', '0001_initial'),
        ('post', '0003_alter_post_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='notification',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='notification.notification'),
        ),
    ]