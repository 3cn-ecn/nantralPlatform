# Generated by Django 3.2.4 on 2021-09-26 18:01

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("academic", "0005_migrate_data"),
    ]

    operations = [
        migrations.AddField(
            model_name="course",
            name="archived",
            field=models.BooleanField(
                default=False,
                verbose_name="Formation archivée",
            ),
        ),
        migrations.AlterField(
            model_name="course",
            name="slug",
            field=models.SlugField(blank=True, max_length=40, unique=True),
        ),
        migrations.AlterField(
            model_name="course",
            name="type",
            field=models.CharField(
                choices=[
                    ("OD", "Option Disciplinaire"),
                    ("OP", "Option Professionnelle"),
                    ("ITII", "Filière de Specialité (ITII)"),
                    ("Master", "Master"),
                    ("BBA", "Bachelor"),
                ],
                max_length=10,
                verbose_name="Type de cours",
            ),
        ),
        migrations.DeleteModel(
            name="FollowCourse",
        ),
    ]
