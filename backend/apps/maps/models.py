from django.db import models

from apps.utils.geocoding import geocode
from apps.group.models import Group


class Map(models.Model):
    """Represents a map. Can also been called a PlaceType."""

    # Type infos
    name = models.CharField(
        verbose_name="Nom de la carte",
        unique=True,
        max_length=20)
    slug = models.SlugField(
        verbose_name="Abréviation du type",
        primary_key=True,
        max_length=10)


class Place(models.Model):
    """
    Represents a point on a map (`maps.Map`). It can correspond to a group,
    but also to an independant entity
    """

    place_type = models.ForeignKey(to=Map, on_delete=models.CASCADE)
    name = models.CharField("Nom du lieu", max_length=50, blank=True)
    summary = models.CharField("Résumé", max_length=500, null=True, blank=True)
    address = models.CharField("Adresse", max_length=250, blank=True)
    latitude = models.FloatField("Latitude", null=True, blank=True)
    longitude = models.FloatField("Longitude", null=True, blank=True)

    def get_most_recent_group(self) -> Group:
        pass

    def update_group_data(self) -> None:
        group = self.get_most_recent_group()
        if group:
            self.name = (
                group.name[:50] if len(group.name) <= 50
                else group.name[:47] + '...')
            self.summary = (
                group.summary[:50] if len(group.summary) <= 50
                else group.summary[:47] + '...')

    def save(self, *args, **kwargs) -> None:
        if (
            self.address
            and not (self.latitude and self.longitude)
        ):
            adresses = geocode(self.address, limit=1)
            if len(adresses) >= 1:
                coordinates = adresses[0]
                self.latitude = coordinates['lat']
                self.longitude = coordinates['long']

    def get_absolute_url(self) -> str | None:
        group = self.get_most_recent_group()
        if group:
            return group.get_absolute_url()
        else:
            return None
