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
        max_length=250, verbose_name='Adresse')
    details = models.CharField(
        max_length=100, verbose_name='Complément d\'adresse', null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def save(self, *args, **kwargs):
        coordinates = geocode(self.address)[0]
        self.latitude = coordinates['lat']
        self.longitude = coordinates['long']
        super(Housing, self).save(*args, **kwargs)

    def __str__(self):
        return self.address if self.address else self.id
    
    @property
    def last_roommates(self):
        last_roommates = Roommates.objects.filter(housing=self).order_by('begin_date').last()
        return last_roommates
    
    @property
    def name(self):
        if self.last_roommates:
            return self.last_roommates.name
        else:
            return "La coloc du " + self.address
    
    @property
    def mini_slug(self):
        return self.last_roommates.mini_slug
    
    @property
    def get_absolute_url(self):
        return self.last_roommates.get_absolute_url

    @property
    def get_absolute_edit_url(self):
        return self.last_roommates.get_absolute_edit_url



class Roommates(Group):
    name = models.CharField(verbose_name='Nom du groupe',
                            max_length=100)
    begin_date = models.DateField("Date d'emménagement", default=date.today)
    end_date = models.DateField("Date de sortie", null=True, blank=True)
    housing = models.ForeignKey(
        to=Housing, on_delete=models.CASCADE)
    members = models.ManyToManyField(
        to=Student, through='NamedMembershipRoommates', blank=True)

    class Meta:
        verbose_name_plural = "Roommates"
    
    @property
    def get_absolute_edit_url(self):
        return reverse('roommates:update', kwargs={'mini_slug': self.mini_slug})
    
    @property
    def get_absolute_url(self):
        return reverse('roommates:detail', kwargs={'mini_slug': self.mini_slug})


class NamedMembershipRoommates(NamedMembership):
    group = models.ForeignKey(
        to=Roommates, on_delete=models.CASCADE)
    nickname = models.CharField(
        max_length=100, verbose_name='Surnom', blank=True, null=True)

    def __str__(self):
        if self.nickname:
            return f'{self.nickname} ({self.student.name})'
        else:
            return self.student.name
            
