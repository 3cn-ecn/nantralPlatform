from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.
class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    promo = models.IntegerField(verbose_name='Année de promotion', null=True, blank=True)
    first_name = models.CharField(max_length=200, verbose_name='Prénom', null=True)
    last_name = models.CharField(max_length=200, verbose_name='Nom de famille', null=True)


@receiver(post_save, sender=User)
def update_student_signal(sender, instance, created, **kwargs):
    if created:
        Student.objects.create(user=instance)
    instance.student.save()
