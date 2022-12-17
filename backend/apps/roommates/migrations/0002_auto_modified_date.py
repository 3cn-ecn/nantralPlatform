# Generated by Django 3.2.3 on 2021-06-05 21:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0003_alter_student_options'),
        ('roommates', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='roommates',
            name='modified_date',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='roommates',
            name='admins',
            field=models.ManyToManyField(blank=True, related_name='roommates_admins', to='student.Student', verbose_name='Admins du groupe'),
        ),
    ]