# Generated by Django 3.0.8 on 2020-10-22 18:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='student',
            old_name='double_degree',
            new_name='path'
        ),
        migrations.AlterField(
            model_name='student',
            name='path',
            field=models.CharField(blank=True, choices=[('Cla', ''), ('Alt', 'Alternance'), ('I-A', 'Ingénieur-Architecte'), ('A-I', 'Architecte-Ingénieur'), ('I-M', 'Ingénieur-Manager'), ('M-I', 'Manager-Ingénieur'), ('I-O', 'Ingénieur-Officier'), ('O-I', 'Officier-Ingénieur')], max_length=200, null=True, verbose_name='Cursus')
        )
    ]