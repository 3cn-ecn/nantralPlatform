from django.db import models
from django.utils.text import slugify
from apps.group.models import Group


VISIBILITY = [
    ('Pub', 'Public - Visible par tous'),
    ('Mem', 'Membres - Visible uniquement par les membres du groupe')
]

class BaseEvent(models.Model):
    date = models.DateTimeField(verbose_name='Date de l\'événement')
    title = models.CharField(max_length=200, verbose_name='Titre de l\'événement')
    description = models.TextField(verbose_name='Description de l\'événement')
    location = models.CharField(max_length=200, verbose_name='Lieu')
    publicity = models.CharField(max_length=200, verbose_name='Visibilité de l\'événement', choices=VISIBILITY)
    group = models.SlugField(verbose_name='Groupe organisateur')
    slug = models.SlugField(verbose_name='Slug de l\'événement', unique=True)

    @property
    def get_group(self):
        return Group.get_group_by_slug(self.group)

    def save(self, *args, **kwargs):
        self.slug = f'bevent--{slugify(self.title)}'
        super(BaseEvent, self).save(*args, **kwargs)


class EatingEvent(BaseEvent):
    menu = models.TextField(verbose_name='Menu de l\'événement')

    def save(self, *args, **kwargs):
        self.slug = f'eevent--{slugify(self.title)}'
        super(EatingEvent, self).save(*args, **kwargs)