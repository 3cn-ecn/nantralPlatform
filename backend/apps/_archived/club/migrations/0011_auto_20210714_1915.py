# Generated by Django 3.2.4 on 2021-07-14 17:15

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("club", "0010_auto_20210703_0000"),
    ]

    operations = [
        migrations.AlterField(
            model_name="club",
            name="banniere",
            field=models.ImageField(
                blank=True,
                help_text="Votre bannière sera affichée au format 1320x492 pixels.",
                null=True,
                upload_to="groups/banniere/club",
                verbose_name="Bannière",
            ),
        ),
        migrations.AlterField(
            model_name="club",
            name="logo",
            field=models.ImageField(
                blank=True,
                help_text="Votre logo sera affiché au format 306x306 pixels.",
                null=True,
                upload_to="groups/logo/club",
                verbose_name="Logo du club",
            ),
        ),
    ]
