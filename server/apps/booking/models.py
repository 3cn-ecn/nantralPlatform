from django.db import models
from django_ckeditor_5.fields import CKEditor5Field
from django.contrib.auth.models import User
from django.urls import reverse
from apps.utils.accessMixins import OwnedObject


class Service(OwnedObject):
    name = models.CharField(verbose_name='Nom du service', max_length=32)
    description = CKEditor5Field(null=True, blank=True)
    group = models.SlugField()
    conditions = CKEditor5Field(null=True, blank=True)
    price = models.FloatField(verbose_name='Prix', null=True, blank=True)
    payment_link = models.URLField(
        verbose_name='Lien de paiement', null=True, blank=True)

    def get_absolute_url(self):
        return reverse('booking:service-detail', kwargs={'pk': self.id})

    @property
    def get_edit_url(self):
        return reverse('booking:service-edit', kwargs={'pk': self.id})


class Availabilty(models.Model):
    start = models.DateTimeField(verbose_name='Début de la disponibilité')
    end = models.DateTimeField(
        verbose_name='Fin de la disponibilité', null=True, blank=True)
    quantity = models.IntegerField(
        verbose_name='Nombre de réservations possibles pour ce créneau.', default=1)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)


class Booking(models.Model):
    taken_by = models.ForeignKey(User, on_delete=models.CASCADE)
    paid = models.BooleanField(null=True, blank=True)
