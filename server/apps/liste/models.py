from django.db import models
from apps.student.models import Student
from apps.group.models import Group, NamedMembership
from apps.club.models import BDX


class Liste(Group):
    liste_type = models.ForeignKey(
        BDX, on_delete=models.SET_NULL, null=True, blank=True)
    year = models.IntegerField(
        verbose_name='Année de la liste')
    members = models.ManyToManyField(Student, through='NamedMembershipList')

    class Meta:
        ordering = ['-year', 'liste_type', 'name']


class NamedMembershipList(NamedMembership):
    function = models.CharField(
        verbose_name='Rôle (facultatif)', max_length=200, blank=True)
    group = models.ForeignKey(Liste, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('function', 'student', 'group')
