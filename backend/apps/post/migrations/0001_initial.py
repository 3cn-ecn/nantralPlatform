# Generated by Django 3.0.8 on 2021-04-05 17:10

import django
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Post",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "publication_date",
                    models.DateTimeField(
                        default=django.utils.timezone.now,
                        verbose_name="Date de publication",
                    ),
                ),
                (
                    "title",
                    models.CharField(
                        max_length=200,
                        verbose_name="Titre de l'annonce",
                    ),
                ),
                (
                    "description",
                    models.TextField(verbose_name="Texte de l'annonce"),
                ),
                (
                    "group",
                    models.SlugField(verbose_name="Groupe publiant l'annonce"),
                ),
                (
                    "slug",
                    models.SlugField(
                        null=True,
                        unique=True,
                        verbose_name="Slug de l'annonce",
                    ),
                ),
                (
                    "color",
                    models.CharField(
                        choices=[
                            ("primary", "Bleu"),
                            ("success", "Vert"),
                            ("danger", "Rouge"),
                            ("warning", "Jaune"),
                            ("secondary", "Gris"),
                            ("dark", "Noir"),
                        ],
                        default="primary",
                        max_length=200,
                        null=True,
                        verbose_name="Couleur de fond",
                    ),
                ),
                (
                    "publicity",
                    models.CharField(
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
                (
                    "image",
                    models.ImageField(
                        blank=True,
                        null=True,
                        upload_to="posts/pictures",
                        verbose_name="Une image, une affiche en lien ?",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
    ]
