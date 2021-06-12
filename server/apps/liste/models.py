from django.db import models
from apps.student.models import Student
from apps.group.models import Group
from apps.club.models import BDX
from apps.utils.upload import PathAndRename

from django.conf import settings

if settings.DEBUG:
    path_and_rename_liste = PathAndRename("./static/upload/groups/logo/liste")
else:
    path_and_rename_liste = PathAndRename("groups/logo/liste")


class Liste(Group):
    liste_type = models.ForeignKey(
        BDX, on_delete=models.SET_NULL, null=True, blank=True)
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
