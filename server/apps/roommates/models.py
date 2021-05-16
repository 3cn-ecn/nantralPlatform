from django.db import models
from apps.group.models import Group
from django.utils.text import slugify
from django.urls.base import reverse

from apps.student.models import Student
from apps.utils.geocoding import geocode


class Housing(models.Model):
    address = models.CharField(
        max_length=250, verbose_name='Adresse de la colocation.')
    details = models.CharField(max_length=100, verbose_name='Détails',
                               null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def save(self, *args, **kwargs):
        coordinates = geocode(self.address)[0]
        self.latitude = coordinates['lat']
        self.longitude = coordinates['long']
        super(Housing, self).save(*args, **kwargs)

    @property
    def get_absolute_url(self):
        return reverse('roommates:housing-view', kwargs={'pk': self.id})

    @property
    def get_absolute_edit_url(self):
        return reverse('roommates:edit-housing', kwargs={'pk': self.id})

    def __str__(self):
        return self.address if self.address else ''


class Roommates(Group):
    begin_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    housing = models.ForeignKey(
        to=Housing, on_delete=models.CASCADE)
    members = models.ManyToManyField(
        to=Student, through='NamedMembershipRoommates', blank=True)

    class Meta:
        verbose_name_plural = "Roommates"

    def save(self, *args, **kwargs):
        self.slug = f'coloc--{slugify(self.name)}-{self.pk}'
        super(Roommates, self).save(*args, **kwargs)


class NamedMembershipRoommates(models.Model):
    student = models.ForeignKey(to=Student, on_delete=models.CASCADE)
    roommates = models.ForeignKey(
        to=Roommates, on_delete=models.CASCADE, blank=True, null=True)
    nickname = models.CharField(
        max_length=100, verbose_name='Surnom', blank=True, null=True)

    def __str__(self):
        return f'{self.student.first_name} {self.student.last_name}' \
            if self.nickname is None else f'{self.student.first_name} {self.student.last_name} alias {self.nickname}'
