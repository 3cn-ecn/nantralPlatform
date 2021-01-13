from django.db import models

from apps.student.models import Student
from apps.academic.models import Course

class Exchange(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    got = models.ForeignKey(Course, related_name = 'got_by', on_delete=models.CASCADE)
    wanted = models.ManyToManyField(Course, blank=True)