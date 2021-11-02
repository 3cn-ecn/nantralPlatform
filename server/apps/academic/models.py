from django.db import models
from django.utils import timezone

from apps.group.models import Group, NamedMembership
from apps.student.models import Student


TYPE = [
    ('OD', 'Option Disciplinaire'),
    ('OP', 'Option Professionnelle'),
    ('ITII', 'Filière de Specialité (ITII)'),
    ('Master', 'Master'),
    ('BBA', 'Bachelor'),
]


class Course(Group):
    type = models.CharField(verbose_name='Type de cours', max_length=10, choices=TYPE)
    members = models.ManyToManyField(Student, through='NamedMembershipCourse')
    archived = models.BooleanField("Formation archivée", default=False)
    
    class Meta:
        verbose_name = "formation"


class NamedMembershipCourse(NamedMembership):
    group = models.ForeignKey(Course, on_delete=models.CASCADE)
    year = models.IntegerField("Année où cette formation a été suivie", default=timezone.now().year)

