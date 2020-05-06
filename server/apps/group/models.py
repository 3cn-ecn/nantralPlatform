from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

from model_utils.managers import InheritanceManager

TYPE_BDX = [
    ('BDA', 'Bureau des arts'),
    ('BDE', 'Bureau des élèves'),
    ('BDS', 'Bureau des sports'),
    ('Asso', 'Association')
]

class Group(models.Model):
    name = models.CharField(verbose_name='Nom du groupe', unique=True, max_length=200)
    description = models.TextField(verbose_name='Description du groupe', blank=True)
    admins = models.ManyToManyField(User, verbose_name='Administrateurs du groupe', related_name='admins')
    members = models.ManyToManyField(User, verbose_name='Membres du groupe', related_name='members')
    logo = models.CharField(verbose_name='Lien vers le logo du groupe', max_length=400, blank=True)
    slug = models.SlugField(max_length=40, unique=True, blank=True)
    class Meta:
        abstract = True

    def __str__(self):
        return self.name


class Club(Group):
    members =  models.ManyToManyField(User, through='NamedMembership')
    bdx_type =  models.CharField(verbose_name='Type de club BDX', choices=TYPE_BDX, max_length=60)

    def save(self, *args, **kwargs):
        self.slug = f'club--{slugify(self.name)}'
        super(Club, self).save(*args, **kwargs)


class NamedMembership(models.Model):
    function = models.CharField(verbose_name='Poste occupé', max_length=200, blank=True)
    year = models.IntegerField(verbose_name='Annee du poste', blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Club, on_delete=models.CASCADE)