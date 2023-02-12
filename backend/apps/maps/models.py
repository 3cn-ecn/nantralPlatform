import datetime

from django.db import models
from django.utils import timezone

from apps.utils.geocoding import geocode


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
    address = models.CharField("Adresse", max_length=250)
    latitude = models.FloatField("Latitude", null=True, blank=True)
    longitude = models.FloatField("Longitude", null=True, blank=True)

    most_recent_group = models.ForeignKey(
        'group.Group',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='+')
    _name = models.CharField("Nom du lieu", max_length=50, blank=True)
    _summary = models.CharField("Résumé", max_length=200, null=True, blank=True)

    @property
    def name(self) -> str:
        """Get the name of the place, following the most recent group name or
        the _name field.

        Returns
        -------
        str
            The name of the place
        """
        if self._name:
            return self._name
        elif self.most_recent_group:
            return self.most_recent_group.name
        else:
            return self.address

    @name.setter
    def name(self, value: str) -> None:
        """Set the name of the place. Alias for the _name field.

        Parameters
        ----------
        value : str
            The new value for _name
        """
        self._name = value

    @property
    def summary(self) -> str:
        """Get the summary for this place, following the _summary field or
        the summary of the most recent group.

        Returns
        -------
        str
            The summary of the place.
        """
        if self._summary:
            return self._summary
        elif self.most_recent_group:
            return self.most_recent_group.summary
        else:
            return ""

    @summary.setter
    def summary(self, value: str) -> None:
        """Set a new value for the summary. Alias for the _summary field.

        Parameters
        ----------
        value : str
            The new value for summary.
        """
        self._summary = value

    def update_most_recent_group(self) -> None:
        """
        Update the most_recent_group field linked to this place. The most
        recent group is the group with the member who has the most recent
        begin_date (lower than the date of today).
        """
        default_date = datetime.date(1987, 1, 1)
        today = timezone.now().today()
        self.most_recent_group = max(
            (self.group_set
                .prefetch_related('membership_set')
                .values('membership_set__begin_date')),
            default=None,
            key=lambda g: max(
                g.membership_set.values('begin_date'),
                default=default_date,
                key=lambda m: (m.begin_date
                               if m.begin_date < today
                               else default_date)
            ).begin_date)
        self.save()

    def save(self, *args, **kwargs) -> None:
        """Find the geo coordinates and save the instance."""
        if self.address and not (self.latitude and self.longitude):
            adresses = geocode(self.address, limit=1)
            if len(adresses) >= 1:
                coordinates = adresses[0]
                self.latitude = coordinates['lat']
                self.longitude = coordinates['long']
        super(Place, self).save(*args, **kwargs)

    def get_absolute_url(self) -> str | None:
        """Get the url to display for this place, i.e. the url of the
        most recent group linked to this place.

        Returns
        -------
        str | None
            The url of the most recent group linked to this place, or None
            if no group is linked.
        """
        if self.most_recent_group:
            return self.most_recent_group.get_absolute_url()
        else:
            return None
