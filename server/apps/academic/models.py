from django.db import models

from apps.student.models import Student


TYPE = [
    ('OD', 'Option Disciplinaire'),
    ('OP', 'Option Professionnelle'),
    ('ITII', 'Filière de Specialité'),
    ('Master', 'Master')
]

MOMENTS = [
    ('EI2', 'EI2'),
    ('EI3', 'EI3'),
    ('ITII', 'ITII'),
    ('M1', 'M1'),
    ('M2', 'M2')
]

class Course(models.Model):
    name = models.CharField(verbose_name='Nom de la formation', max_length=200)
    course_type = models.CharField(verbose_name='Type de cours', max_length=200, choices=TYPE)
    image = models.CharField(verbose_name="Image de l'option", max_length=200, null=True)
    def __str__(self):
        return self.name


class FollowCourse(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    when = models.CharField(verbose_name='Cours suivi en', choices=MOMENTS, max_length=200)
