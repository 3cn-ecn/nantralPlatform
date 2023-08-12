# Generated by Django 4.2.3 on 2023-07-10 21:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0006_alter_student_faculty'),
        ('event', '0014_end_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='end_date',
            field=models.DateTimeField(help_text='Enter date in format DD/MM/YYYY HH:MM', verbose_name='End date'),
        ),
        migrations.AlterField(
            model_name='event',
            name='location',
            field=models.CharField(blank=True, default='', max_length=200, verbose_name='Location'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='event',
            name='participants',
            field=models.ManyToManyField(blank=True, related_name='participating_events', to='student.student', verbose_name='Participants'),
        ),
    ]