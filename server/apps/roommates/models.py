from django.db import models
from apps.group.models import Group
from django.utils.text import slugify

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

    def __str__(self):
        return self.adress if self.adress else ''


class Roommates(Group):
    begin_date = models.DateField()
    end_date = models.DateField()
    housing = models.ForeignKey(to=Housing, on_delete=models.CASCADE)
    members = models.ManyToManyField(
        to=Student, through='NamedMembershipRoommates')

    class Meta:
        verbose_name_plural = "Roommates"

    def save(self, *args, **kwargs):
        self.slug = f'coloc--{slugify(self.name)-self.pk}'
        super(Roommates, self).save(*args, **kwargs)


class NamedMembershipRoommates(models.Model):
    student = models.ForeignKey(to=Student, on_delete=models.CASCADE)
    roommates = models.ForeignKey(to=Roommates, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=100, verbose_name='Surnom')
