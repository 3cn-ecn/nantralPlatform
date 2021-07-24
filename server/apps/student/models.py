from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.urls import reverse
from django.conf import settings

from apps.utils.upload import PathAndRename
from apps.utils.compress import compressImage


FACULTIES = [
    ('Gen', 'Élève Ingénieur Généraliste'),
    ('Iti', 'Élève Ingénieur de Specialité (ITII)'),
    ('Mas', 'Élève en Master'),
    ('Doc', 'Doctorant')
]

PATHS = [
    ('Cla', ''),
    ('Alt', 'Alternance'),
    ('I-A', 'Ingénieur-Architecte'),
    ('A-I', 'Architecte-Ingénieur'),
    ('I-M', 'Ingénieur-Manager'),
    ('M-I', 'Manager-Ingénieur'),
    ('I-O', 'Ingénieur-Officier'),
    ('O-I', 'Officier-Ingénieur')
]

path_and_rename = PathAndRename("students/profile_pictures")


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    promo = models.IntegerField(
        verbose_name='Année de promotion entrante', null=True, blank=True)
    picture = models.ImageField(
        verbose_name='Photo de profil', upload_to=path_and_rename, null=True, blank=True)
    first_name = models.CharField(
        max_length=200, verbose_name='Prénom', null=True)
    last_name = models.CharField(
        max_length=200, verbose_name='Nom de famille', null=True)
    faculty = models.CharField(
        max_length=200, verbose_name='Filière', choices=FACULTIES)
    path = models.CharField(
        max_length=200, verbose_name='Cursus', choices=PATHS, null=True, blank=True)

    def __str__(self):
        if self.first_name and self.last_name:
            return f'{self.first_name.capitalize()} {self.last_name.upper()}'
        elif self.first_name:
            return self.first_name.capitalize()
        elif self.last_name:
            return self.last_name.upper()
        else:
            return f'{self.id}'

    def get_absolute_url(self):
        return reverse('student:detail', args=[self.pk])
    
    def save(self, *args, **kwargs):
        if not self.pk or self.picture != Student.objects.get(pk=self.pk).picture:
            self.picture = compressImage(self.picture)
        super(Student, self).save(*args, **kwargs)
    
    class Meta:
        ordering = ['last_name', 'first_name']



@receiver(post_save, sender=User)
def update_student_signal(sender, instance, created, **kwargs):
    if not instance.is_superuser:
        if created:
            Student.objects.create(user=instance)
        instance.student.save()
