import os
from uuid import uuid4

from django.db import models
from django.utils.deconstruct import deconstructible
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.urls import reverse


FACULTIES = [
    ('Gen', 'Eleve ingenieur generaliste'),
    ('Iti', 'Eleve ingenieur de specialité'),
    ('Mas', 'Eleve en master'),
    ('Doc', 'Doctorant')
]

DOUBLE_DEGREES = [
    ('Cla',''),
    ('I-A','Ingénieur-Architect'),
    ('A-I','Architect-Ingenieur'),
    ('I-M','Ingenieur-Manager'),
    ('M-I','Manager-Ingénieur'),
    ('I-O','Ingénieur-Officier'),
    ('O-I','Officier-Ingénieur')
]

@deconstructible
class PathAndRename(object):

    def __init__(self, sub_path):
        self.path = sub_path

    def __call__(self, instance, filename):
        ext = filename.split('.')[-1]
        # get filename
        if instance.pk:
            filename = f'{instance.pk}.{ext}'
        else:
            # set filename as random string
            filename = f'{uuid4().hex}.{ext}'
        # return the whole path to the file
        return os.path.join(self.path, filename)

path_and_rename = PathAndRename("students/profile_pictures")


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    promo = models.IntegerField(verbose_name='Année de promotion', null=True, blank=True)
    picture = models.ImageField(verbose_name='Photo de profil', upload_to=path_and_rename, null=True, blank=True)
    first_name = models.CharField(max_length=200, verbose_name='Prénom', null=True)
    last_name = models.CharField(max_length=200, verbose_name='Nom de famille', null=True)
    faculty = models.CharField(max_length=200, verbose_name='Filliere', choices=FACULTIES)
    double_degree = models.CharField(max_length=200, verbose_name='Double-cursus', choices=DOUBLE_DEGREES, null=True, blank=True)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

    def get_absolute_url(self):
        return reverse('student:detail', args=[self.pk])

@receiver(post_save, sender=User)
def update_student_signal(sender, instance, created, **kwargs):
    if not instance.is_superuser:
        if created:
            Student.objects.create(user=instance)
        instance.student.save()

