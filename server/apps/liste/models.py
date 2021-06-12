from django.db import models
from apps.student.models import Student
from apps.group.models import Group
from apps.utils.upload import PathAndRename

from django.conf import settings

if settings.DEBUG:
    path_and_rename_liste = PathAndRename("./static/upload/groups/logo/liste")
else:
    path_and_rename_liste = PathAndRename("groups/logo/liste")

TYPE_LISTE = [
    ('BDA', 'Bureau des Arts'),
    ('BDE', 'Bureau des Élèves'),
    ('BDS', 'Bureau des Sports')
]


class Liste(Group):
    liste_type = models.CharField(
        verbose_name='Type de liste BDX', choices=TYPE_LISTE, max_length=60)
    year = models.IntegerField(
        verbose_name='Année de la liste', blank=True, null=True)
    members = models.ManyToManyField(Student, through='NamedMembershipList')
    logo = models.ImageField(verbose_name='Logo de la liste',
                             blank=True, null=True, upload_to=path_and_rename_liste)


class NamedMembershipList(models.Model):
    function = models.CharField(
        verbose_name='Poste occupé', max_length=200, blank=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    liste = models.ForeignKey(Liste, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('function', 'student', 'liste')
