# Generated by Django 3.2.4 on 2021-08-06 09:39


from django.db import migrations
from apps.utils.compress import compressImage


def compress(model, Group):
    for object in model.objects.all():
        try:
            object.logo = compressImage(object.logo, size=(500,500), contains=True)
            object.banniere = compressImage(object.banniere, size=(1320,492), contains=False)
            super(Group, object).save()
        except Exception:
            print("Fichier non existant")

def main_operations(apps, schema_editor):
    Club = apps.get_model('club', 'Club')
    Liste = apps.get_model('liste', 'Liste')
    Roommates = apps.get_model('roommates', 'Roommates')
    Group = apps.get_model('group', 'Group')
    compress(Club, Group)
    compress(Liste, Group)
    compress(Roommates, Group)


class Migration(migrations.Migration):

    dependencies = [
        ('group', '0007_simplify_slug'),
        ('club', '0014_auto_20210806_1138'),
        ('liste', '0012_auto_20210806_1138'),
        ('roommates', '0010_auto_20210806_1138'),
    ]

    operations = [
        migrations.RunPython(main_operations),
    ]
