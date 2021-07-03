from django.db import models
from apps.student.models import Student
from apps.group.models import Group, NamedMembership
from apps.club.models import BDX
from apps.utils.upload import PathAndRename

from django.conf import settings
from django.urls.base import reverse


path_and_rename_liste = PathAndRename("groups/logo/liste")
path_and_rename_liste_banniere = PathAndRename("groups/banniere/club")


class Liste(Group):
    liste_type = models.ForeignKey(
        BDX, on_delete=models.SET_NULL, null=True, blank=True)
    year = models.IntegerField(
        verbose_name='Année de la liste', blank=True, null=True)
    members = models.ManyToManyField(Student, through='NamedMembershipList')
    logo = models.ImageField(verbose_name='Logo de la liste',
                             blank=True, null=True, upload_to=path_and_rename_liste)
    banniere = models.ImageField(
        verbose_name='Bannière', blank=True, null=True, upload_to=path_and_rename_liste_banniere)

    class Meta:
        ordering = ['-year', 'liste_type', 'name']

    @property
    def get_absolute_url(self):
        return reverse('liste:detail', kwargs={'group_slug': self.mini_slug})


class NamedMembershipList(NamedMembership):
    function = models.CharField(
        verbose_name='Poste occupé', max_length=200, blank=True)
    group = models.ForeignKey(Liste, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('function', 'student', 'group')
