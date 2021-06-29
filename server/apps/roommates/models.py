from django.db import models
from django.utils.text import slugify
from django.urls.base import reverse
from datetime import date

from apps.group.models import Group, NamedMembership
from apps.student.models import Student
from apps.utils.geocoding import geocode
from apps.sociallink.models import SocialNetwork, SocialLink


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
        return reverse('roommates:housing-details', kwargs={'pk': self.id})

    @property
    def get_absolute_edit_url(self):
        return reverse('roommates:edit-housing', kwargs={'pk': self.id})

    def __str__(self):
        return self.address if self.address else ''
    
    def name(self):
        roommates_list = Roommates.objects.filter(housing=self).order_by('begin_date')
        if roommates_list:
            last_roommates = roommates_list[0]
            return last_roommates.name
        else:
            return "La coloc du " + self.address


class Roommates(Group):
    begin_date = models.DateField("Date d'emménagement", default=date.today)
    end_date = models.DateField("Date de sortie", null=True, blank=True)
    housing = models.ForeignKey(
        to=Housing, on_delete=models.CASCADE)
    members = models.ManyToManyField(
        to=Student, through='NamedMembershipRoommates', blank=True)

    class Meta:
        verbose_name_plural = "Roommates"
    
    @property
    def get_absolute_url(self):
        return reverse('roommates:detail', kwargs={'group_slug': self.mini_slug})

    def save(self, *args, **kwargs):
        self.slug = f'coloc--{slugify(self.name)}-{self.pk}'
        super(Roommates, self).save(*args, **kwargs)


class NamedMembershipRoommates(NamedMembership):
    group = models.ForeignKey(
        to=Roommates, on_delete=models.CASCADE, blank=True, null=True)
    nickname = models.CharField(
        max_length=100, verbose_name='Surnom', blank=True, null=True)

    def __str__(self):
        return f'{self.student.first_name} {self.student.last_name}' \
            if self.nickname is None else f'{self.student.first_name} {self.student.last_name} alias {self.nickname}'
