from django.db import models
from django.utils import timezone

from apps.group.models import Group, NamedMembership
from apps.student.models import Student
from apps.utils.geocoding import geocode
from django.db.models import Q


class Housing(models.Model):
    address = models.CharField(
        max_length=250, verbose_name='Adresse')
    details = models.CharField(
        max_length=100, verbose_name='Complément d\'adresse', null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def save(self, *args, **kwargs):
        coordinates = geocode(self.address)[0]
        if not self.latitude or not self.longitude or abs(self.latitude-coordinates['lat']) > 5e-3 or abs(self.longitude-coordinates['long']) > 5e-3:
            self.latitude = coordinates['lat']
            self.longitude = coordinates['long']
        super(Housing, self).save(*args, **kwargs)

    def __str__(self):
        return self.address if self.address else self.id

    @property
    def current_roommates(self):
        now = timezone.now()
        return Roommates.objects.filter(Q(housing=self) & (Q(Q(begin_date__lte=now) & (
            Q(end_date__gte=now) | Q(end_date=None))) | (Q(members=None)))).order_by('begin_date').last()


class Roommates(Group):
    name = models.CharField(verbose_name='Nom du groupe',
                            max_length=100)
    begin_date = models.DateField("Date d'emménagement", default=timezone.now().today)
    end_date = models.DateField("Date de sortie", null=True, blank=True)
    housing = models.ForeignKey(
        to=Housing, on_delete=models.CASCADE)
    members = models.ManyToManyField(
        to=Student, through='NamedMembershipRoommates', blank=True)

    class Meta:
        verbose_name = "coloc"


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
