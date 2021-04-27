from django.db import models
from apps.group.models import Group
from django.utils.text import slugify

from apps.utils.geocoding import geocode


class Housing(models.Model):
    address = models.CharField(max_length=250)
    details = models.CharField(max_length=100, null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def save(self, *args, **kwargs):
        coordinates = geocode(self.address)[0]
        self.latitude = coordinates['lat']
        self.longitude = coordinates['long']
        super(Housing, self).save(*args, **kwargs)


class Roommates(Group):
    begin_date = models.DateField()
    end_date = models.DateField()
    housing = models.ForeignKey(to=Housing, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "Roommates"

    def save(self, *args, **kwargs):
        self.slug = f'coloc--{slugify(self.name)}'
        super(Roommates, self).save(*args, **kwargs)
