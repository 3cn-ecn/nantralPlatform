# Generated by Django 4.2.4 on 2023-09-05 10:53

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("account", "0008_custom_user_model"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="user",
            options={"verbose_name": "user", "verbose_name_plural": "users"},
        ),
        migrations.AlterModelManagers(
            name="user",
            managers=[],
        ),
        migrations.AlterField(
            model_name="user",
            name="email",
            field=models.EmailField(max_length=254, unique=True),
        ),
        migrations.AlterModelTable(
            name="user",
            table=None,
        ),
    ]
