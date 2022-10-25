from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.urls import reverse

from apps.utils.upload import PathAndRename
from apps.utils.compress import compress_model_image


FACULTIES = [
    ('Gen', 'Élève Ingénieur Généraliste'),
    ('Iti', 'Élève Ingénieur de Spécialité (ITII)'),
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
        verbose_name='Photo de profil',
        upload_to=path_and_rename,
        null=True,
        blank=True)
    faculty = models.CharField(
        max_length=200, verbose_name='Filière', choices=FACULTIES)
    path = models.CharField(
        max_length=200,
        verbose_name='Cursus',
        choices=PATHS,
        null=True,
        blank=True)

    @property
    def name(self):
        '''Renvoie le nom de l'utilisateur au format Prénom NOM.'''
        if self.user.first_name and self.user.last_name:
            return (
                f'{self.user.first_name.title()} {self.user.last_name.upper()}')
        elif self.user.first_name:
            return self.user.first_name.title()
        elif self.user.last_name:
            return self.user.last_name.title()
        else:
            return self.user.username

    @property
    def alphabetical_name(self):
        '''Renvoie le nom de l'utilisateur au format NOM Prénom.'''
        if self.user.first_name and self.user.last_name:
            return (
                f'{self.user.last_name.upper()} {self.user.first_name.title()}')
        else:
            return self.name

    def __str__(self):
        return self.alphabetical_name

    # Don't make this a property, Django expects it to be a method.
    # Making it a property can cause a 500 error (see issue #553).
    def get_absolute_url(self) -> str:
        return reverse('student:detail', args=[self.pk])

    @property
    def absolute_url(self) -> str:
        return self.get_absolute_url()

    def save(self, *args, **kwargs):
        self.picture = compress_model_image(self, 'picture')
        super(Student, self).save(*args, **kwargs)

    class Meta:
        ordering = ['user__last_name', 'user__first_name']


@receiver(post_save, sender=User)
def update_student_signal(sender, instance, created, **kwargs):
    if not instance.is_superuser:
        if created:
            Student.objects.create(user=instance)
        instance.student.save()
