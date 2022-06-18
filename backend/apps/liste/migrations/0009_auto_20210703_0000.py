# Generated by Django 3.2.3 on 2021-07-02 22:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('liste', '0008_alter_liste_description'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='liste',
            name='social',
        ),
        migrations.AddField(
            model_name='liste',
            name='summary',
            field=models.CharField(blank=True, max_length=500, null=True, verbose_name='Résumé'),
        ),
        migrations.AddField(
            model_name='liste',
            name='video1',
            field=models.URLField(blank=True, null=True, verbose_name='Lien vidéo 1'),
        ),
        migrations.AddField(
            model_name='liste',
            name='video2',
            field=models.URLField(blank=True, null=True, verbose_name='Lien vidéo 2'),
        ),
        migrations.AlterField(
            model_name='liste',
            name='alt_name',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='Nom alternatif'),
        ),
        migrations.AlterField(
            model_name='liste',
            name='name',
            field=models.CharField(max_length=100, unique=True, verbose_name='Nom du groupe'),
        ),
    ]