# Generated by Django 4.2.13 on 2024-07-17 10:30

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("sociallink", "0005_alter_sociallink_label_alter_sociallink_url"),
        ("group", "0013_alter_group_video1_alter_group_video2"),
    ]

    operations = [
        migrations.RenameField(
            model_name="membership",
            old_name="admin_request_messsage",
            new_name="admin_request_message",
        ),
        migrations.AlterField(
            model_name="group",
            name="social_links",
            field=models.ManyToManyField(
                blank=True,
                related_name="group_set",
                to="sociallink.sociallink",
                verbose_name="Social networks",
            ),
        ),
    ]