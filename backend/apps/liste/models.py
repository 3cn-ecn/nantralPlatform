from django.db import models

from django.core.cache import cache
from django.core.cache.utils import make_template_fragment_key

from apps.student.models import Student
from apps.group.abstract.models import AbstractGroup, NamedMembership
from apps.club.models import BDX


class Liste(AbstractGroup):
    liste_type = models.ForeignKey(
        BDX, on_delete=models.SET_NULL, null=True, blank=True)
    year = models.IntegerField(
        verbose_name='Année de la liste')
    members = models.ManyToManyField(Student, through='NamedMembershipList')

    app_name = "Listes BDX"

    class Meta:
        ordering = ['-year', 'liste_type', 'name']
        verbose_name = "Liste BDX"
        verbose_name_plural = "Listes BDX"

    def save(self, *args, **kwargs):
        # mise à jour du cache de la liste des listes
        key = make_template_fragment_key('liste_list')
        cache.delete(key)
        # enregistrement
        super().save(*args, **kwargs)


class NamedMembershipList(NamedMembership):
    function = models.CharField(
        verbose_name='Rôle (facultatif)', max_length=200, blank=True)
    group = models.ForeignKey(Liste, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('function', 'student', 'group')
