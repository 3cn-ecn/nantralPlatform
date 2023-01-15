# Generated by Django 4.1.5 on 2023-01-15 12:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0006_alter_student_faculty'),
        ('group', '0018_group_subscribers_alter_group_social_links'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='group',
            name='anyone_can_join',
        ),
        migrations.AddField(
            model_name='group',
            name='restrict_membership',
            field=models.BooleanField(default=False, help_text="Masque le bouton 'Devenir membre'. Seuls les admins pourront ajouter de nouveaux membres.", verbose_name='Adhésion restreinte'),
        ),
        migrations.AlterField(
            model_name='group',
            name='members',
            field=models.ManyToManyField(blank=True, related_name='groups', through='group.Membership', to='student.student', verbose_name='Membres du groupe'),
        ),
        migrations.AlterField(
            model_name='group',
            name='subscribers',
            field=models.ManyToManyField(blank=True, related_name='subscriptions', to='student.student', verbose_name='Abonnés'),
        ),
    ]