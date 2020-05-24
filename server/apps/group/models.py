from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.urls.base import reverse

from apps.student.models import Student
from apps.utils.upload import PathAndRename
from model_utils.managers import InheritanceManager


TYPE_BDX = [
    ('BDA', 'Bureau des arts'),
    ('BDE', 'Bureau des élèves'),
    ('BDS', 'Bureau des sports'),
    ('Asso', 'Association')
]

path_and_rename = PathAndRename("groups/logo")

class Group(models.Model):
    name = models.CharField(verbose_name='Nom du groupe', unique=True, max_length=200)
    description = models.TextField(verbose_name='Description du groupe', blank=True)
    admins = models.ManyToManyField(Student, verbose_name='Administrateurs du groupe', related_name='admins')
    members = models.ManyToManyField(Student, verbose_name='Membres du groupe', related_name='members')
    logo = models.ImageField(verbose_name='Logo du groupe', blank=True, null=True, upload_to=path_and_rename)
    slug = models.SlugField(max_length=40, unique=True, blank=True)
    class Meta:
        abstract = True

    def __str__(self):
        return self.name

    def is_admin(self, user: User) -> bool:
        """Indicates if a user is admin."""
        student = Student.objects.filter(user=user).first()
        return student in self.admins.all()
    
    @staticmethod
    def get_group_by_slug(slug:  str):
        """Get a group from a slug."""
        type_slug = slug.split('--')[0]
        if type_slug == 'club':
            return Club.objects.get(slug=slug)
        else:
            return Group.objects.get(slug=slug)
    
    @property
    def get_absolute_url(self):
        return reverse('group:detail', kwargs={'pk': self.pk})


class Club(Group):
    members =  models.ManyToManyField(Student, through='NamedMembership')
    bdx_type =  models.CharField(verbose_name='Type de club BDX', choices=TYPE_BDX, max_length=60)

    def save(self, *args, **kwargs):
        self.slug = f'club--{slugify(self.name)}'
        super(Club, self).save(*args, **kwargs)


class NamedMembership(models.Model):
    function = models.CharField(verbose_name='Poste occupé', max_length=200, blank=True)
    year = models.IntegerField(verbose_name='Annee du poste', blank=True, null=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    group = models.ForeignKey(Club, on_delete=models.CASCADE)