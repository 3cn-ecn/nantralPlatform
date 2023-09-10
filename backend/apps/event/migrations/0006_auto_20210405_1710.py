# Generated by Django 3.0.8 on 2021-04-05 17:10

from django.db import migrations, models
from django.utils import timezone


class Migration(migrations.Migration):
    dependencies = [
        ("event", "0005_auto_20201107_2109"),
    ]

    operations = [
        migrations.AddField(
            model_name="baseevent",
            name="publication_date",
            field=models.DateTimeField(
                default=timezone.now(), verbose_name="Date de publication"
            ),
        ),
        migrations.AlterField(
            model_name="baseevent",
            name="image",
            field=models.ImageField(
                blank=True,
                null=True,
                upload_to="posts/pictures",
                verbose_name="Une image, une affiche en lien ?",
            ),
        ),
        migrations.AlterField(
            model_name="baseevent",
            name="publicity",
            field=models.CharField(
                choices=[
                    ("Pub", "Public - Visible par tous"),
                    (
                        "Mem",
                        "Membres uniquement - Visible uniquement par les membres du groupe",
                    ),
                ],
                max_length=200,
                verbose_name="Visibilité de l'annonce",
            ),
        ),
    ]
