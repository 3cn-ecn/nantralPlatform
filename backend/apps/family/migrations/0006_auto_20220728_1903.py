# Generated by Django 3.2.13 on 2022-07-28 17:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('family', '0005_delete_affichage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='family',
            name='non_subscribed_members',
            field=models.CharField(blank=True, help_text='Si certains des membres de la famille ne sont pas inscrits             sur Nantral Platform, vous pouvez les ajouter ici. Séparez les             noms par des VIRGULES !!!', max_length=300, null=True, verbose_name='Autres parrains'),
        ),
        migrations.AlterField(
            model_name='questionfamily',
            name='equivalent',
            field=models.OneToOneField(blank=True, help_text="Question équivalente dans le questionnaire des membres.             Laissez vide si vous souhaitez que cette question ne soit pas             prise en compte dans l'algo.", null=True, on_delete=django.db.models.deletion.CASCADE, related_name='equivalent', to='family.questionmember', verbose_name='Question équivalente'),
        ),
        migrations.AlterField(
            model_name='questionfamily',
            name='quota',
            field=models.IntegerField(help_text='Pourcentage de prise en compte de cette question dans le             calcul des réponses du parrain. 100 supprime la question du             questionnaire parrain (mais pas du questionnaire filleul).', verbose_name='Quota'),
        ),
    ]
