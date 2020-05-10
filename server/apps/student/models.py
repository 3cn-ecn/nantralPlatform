from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


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
class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    promo = models.IntegerField(verbose_name='Année de promotion', null=True, blank=True)
    first_name = models.CharField(max_length=200, verbose_name='Prénom', null=True)
    last_name = models.CharField(max_length=200, verbose_name='Nom de famille', null=True)
    faculty = models.CharField(max_length=200, verbose_name='Filliere', choices=FACULTIES)
    double_degree = models.CharField(max_length=200, verbose_name='Double-cursus', choices=DOUBLE_DEGREES, null=True, blank=True)
    def __str__(self):
        return f'{self.first_name} {self.last_name}'


@receiver(post_save, sender=User)
def update_student_signal(sender, instance, created, **kwargs):
    if not instance.is_superuser:
        if created:
            Student.objects.create(user=instance)
        instance.student.save()
