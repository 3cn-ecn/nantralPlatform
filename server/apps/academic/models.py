from django.db import models
from datetime import date

from apps.group.models import Group, NamedMembership
from apps.student.models import Student


TYPE = [
    ('OD', 'Option Disciplinaire'),
    ('OP', 'Option Professionnelle'),
    ('ITII', 'Filière de Specialité (ITII)'),
    ('Master', 'Master'),
    ('BBA', 'Bachelor'),
]

MOMENTS = [
    ('EI2', 'EI2'),
    ('EI3', 'EI3'),
    ('ITII', 'ITII'),
    ('M1', 'M1'),
    ('M2', 'M2')
]

class Course(Group):
    type = models.CharField(verbose_name='Type de cours', max_length=10, choices=TYPE)
    members = models.ManyToManyField(Student, through='NamedMembershipCourse')
    #archived = models.BooleanField("Formation archivée", default=False)
    
    class Meta:
        verbose_name = "formation"


class NamedMembershipCourse(NamedMembership):
    group = models.ForeignKey(Course, on_delete=models.CASCADE)
    year = models.IntegerField("Année où cette formation a été suivie", default=date.today().year)


class FollowCourse(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    when = models.CharField(verbose_name='Cours suivi en', choices=MOMENTS, max_length=200)

