# Generated by Django 3.2.5 on 2021-11-18 19:04

import django.db.models.deletion
from django.db import migrations, models

import django_ckeditor_5.fields

import apps.utils.slug


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("student", "0005_auto_20210801_1726"),
    ]

    operations = [
        migrations.CreateModel(
            name="Administration",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        max_length=100,
                        unique=True,
                        verbose_name="Nom du groupe",
                    ),
                ),
                (
                    "alt_name",
                    models.CharField(
                        blank=True,
                        max_length=100,
                        null=True,
                        verbose_name="Nom alternatif",
                    ),
                ),
                (
                    "logo",
                    models.ImageField(
                        blank=True,
                        help_text="Votre logo sera affiché au format 306x306 pixels.",
                        null=True,
                        upload_to="groups/logo",
                        verbose_name="Logo du groupe",
                    ),
                ),
                (
                    "banniere",
                    models.ImageField(
                        blank=True,
                        help_text="Votre bannière sera affichée au format 1320x492 pixels.",
                        null=True,
                        upload_to="groups/banniere",
                        verbose_name="Bannière",
                    ),
                ),
                (
                    "summary",
                    models.CharField(
                        blank=True,
                        max_length=500,
                        null=True,
                        verbose_name="Résumé",
                    ),
                ),
                (
                    "description",
                    django_ckeditor_5.fields.CKEditor5Field(
                        blank=True, verbose_name="Description du groupe"
                    ),
                ),
                (
                    "video1",
                    models.URLField(
                        blank=True, null=True, verbose_name="Lien vidéo 1"
                    ),
                ),
                (
                    "video2",
                    models.URLField(
                        blank=True, null=True, verbose_name="Lien vidéo 2"
                    ),
                ),
                (
                    "slug",
                    models.SlugField(blank=True, max_length=40, unique=True),
                ),
                ("modified_date", models.DateTimeField(auto_now=True)),
            ],
            options={
                "abstract": False,
            },
            bases=(models.Model, apps.utils.slug.SlugModel),
        ),
        migrations.CreateModel(
            name="NamedMembershipAdministration",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("admin", models.BooleanField(default=False)),
                (
                    "function",
                    models.CharField(
                        blank=True,
                        max_length=200,
                        verbose_name="Rôle (facultatif)",
                    ),
                ),
                (
                    "group",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="administration.administration",
                    ),
                ),
                (
                    "student",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="student.student",
                    ),
                ),
            ],
            options={
                "unique_together": {("student", "group")},
            },
        ),
        migrations.AddField(
            model_name="administration",
            name="members",
            field=models.ManyToManyField(
                through="administration.NamedMembershipAdministration",
                to="student.Student",
            ),
        ),
    ]
