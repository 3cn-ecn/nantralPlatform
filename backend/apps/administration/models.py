from django.db import models

from apps.student.models import Student
from apps.group.models import AbstractGroup, NamedMembership


class Administration(AbstractGroup):
    members = models.ManyToManyField(
        Student, through='NamedMembershipAdministration')


class NamedMembershipAdministration(NamedMembership):
    function = models.CharField(
        verbose_name='Rôle (facultatif)', max_length=200, blank=True)
    group = models.ForeignKey(Administration, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('student', 'group')
