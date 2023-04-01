# Generated by Django 4.1.4 on 2023-03-21 22:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0008_alter_student_favorite_event'),
        ('event', '0016_alter_event_max_participant'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='event',
            name='updated_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='student.student'),
        ),
    ]