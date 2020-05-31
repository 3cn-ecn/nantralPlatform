from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.urls import reverse

from apps.utils.upload import PathAndRename

FACULTIES = [
    ('Gen', 'Elève Ingénieur Généraliste'),
    ('Iti', 'Elève Ingénieur de Specialité (ITII)'),
    ('Mas', 'Elève en Master'),
    ('Doc', 'Doctorant')
]

DOUBLE_DEGREES = [
    ('Cla',''),
    ('I-A','Ingénieur-Architecte'),
    ('A-I','Architecte-Ingénieur'),
    ('I-M','Ingénieur-Manager'),
    ('M-I','Manager-Ingénieur'),
    ('I-O','Ingénieur-Officier'),
    ('O-I','Officier-Ingénieur')
]


path_and_rename = PathAndRename("students/profile_pictures")


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    promo = models.IntegerField(verbose_name='Année de promotion entrante', null=True, blank=True)
    picture = models.ImageField(verbose_name='Photo de profil', upload_to=path_and_rename, null=True, blank=True)
    first_name = models.CharField(max_length=200, verbose_name='Prénom', null=True)
    last_name = models.CharField(max_length=200, verbose_name='Nom de famille', null=True)
    faculty = models.CharField(max_length=200, verbose_name='Filière', choices=FACULTIES)
    double_degree = models.CharField(max_length=200, verbose_name='Double cursus', choices=DOUBLE_DEGREES, null=True, blank=True)

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

