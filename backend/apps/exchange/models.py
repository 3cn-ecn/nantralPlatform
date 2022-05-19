from django.db import models

from apps.student.models import Student
from apps.academic.models import Course

class Exchange(models.Model):
    student = models.OneToOneField(Student, related_name='exchange', on_delete=models.CASCADE)
    got = models.ForeignKey(Course, related_name = 'got_by', on_delete=models.CASCADE, limit_choices_to={'type': 'OD'})
    wanted = models.ManyToManyField(Course, related_name = 'wanted_by', limit_choices_to={'type': 'OD'})