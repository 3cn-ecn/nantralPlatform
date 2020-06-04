from django.db import models
from apps.group.models import Group

VISIBILITY = [
    ('Pub', 'Public - Visible par tous'),
    ('Mem', 'Membres - Visible uniquement par les membres du groupe')
]

class Event(models.Model):
    date = models.DateTimeField(verbose_name='Date de l\'événement')
    title = models.CharField(max_length=200, verbose_name='Titre de l\'événement')
    description = models.TextField(verbose_name='Description de l\'événement')
    location = models.CharField(max_length=200, verbose_name='Lieu')
    publicity = models.CharField(max_length=200, verbose_name='Visibilité de l\'événement', choices=VISIBILITY)
    group = models.SlugField(verbose_name='Groupe organisateur')

    @property
    def get_group(self):
        return Group.get_group_by_slug(self.group)
