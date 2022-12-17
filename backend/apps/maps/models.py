from django.db import models


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
