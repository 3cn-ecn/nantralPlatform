# Generated by Django 3.2.4 on 2021-08-05 13:51

from django.db import migrations
from django.utils.text import slugify

from apps.utils.slug import get_slug_from_full_slug


def simplify_slug(model):
    for object in model.objects.all():
        object.slug = get_slug_from_full_slug(object.slug)
        if not object.slug:
            slug = slugify(object.name)[:35]
            if type(object).objects.filter(slug=slug):
                id = 1
                while type(object).objects.filter(slug=f'{slug}-{id}'):
                    id += 1
                slug = f'{slug}-{id}'
            object.slug = slug
        object.save()


def main_simplify_slug(apps, schema_editor):
    Club = apps.get_model('club', 'Club')
    Liste = apps.get_model('liste', 'Liste')
    Roommates = apps.get_model('roommates', 'Roommates')
    simplify_slug(Club)
    simplify_slug(Liste)
    simplify_slug(Roommates)


class Migration(migrations.Migration):

    dependencies = [
        ('group', '0006_move_club'),
        ('club', '0012_alter_club_options'),
        ('liste', '0010_liste_banniere'),
        ('roommates', '0009_auto_20210805_1446'),
    ]

    operations = [
        migrations.RunPython(main_simplify_slug),
    ]
