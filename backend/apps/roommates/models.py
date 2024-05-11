from django.db import models
from django.db.models import Q
from django.utils import timezone

from apps.group.abstract.models import AbstractGroup, NamedMembership
from apps.student.models import Student
from apps.utils.geocoding import geocode


class Housing(models.Model):
    address = models.CharField(max_length=250, verbose_name="Adresse")
    details = models.CharField(
        max_length=100,
        verbose_name="Complément d'adresse",
        null=True,
        blank=True,
    )
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def save(self, *args, **kwargs):
        coordinates = geocode(self.address)[0]
        if (
            not self.latitude
            or not self.longitude
            or abs(self.latitude - coordinates["lat"]) > 5e-3
            or abs(self.longitude - coordinates["long"]) > 5e-3
        ):
            self.latitude = coordinates["lat"]
            self.longitude = coordinates["long"]
        super(Housing, self).save(*args, **kwargs)

    def __str__(self):
        return self.address if self.address else self.id

    @property
    def current_roommates(self):
        now = timezone.now()
        return (
            Roommates.objects.filter(
                Q(housing=self)
                & (
                    Q(
                        Q(begin_date__lte=now)
                        & (Q(end_date__gte=now) | Q(end_date=None)),
                    )
                    | (Q(members=None))
                ),
            )
            .order_by("begin_date")
            .last()
        )


class Roommates(AbstractGroup):
    name = models.CharField(verbose_name="Nom du groupe", max_length=100)
    begin_date = models.DateField(
        "Date d'emménagement",
        default=timezone.now().today,
    )
    end_date = models.DateField("Date de sortie")
    housing = models.ForeignKey(to=Housing, on_delete=models.CASCADE)
    members = models.ManyToManyField(
        to=Student,
        through="NamedMembershipRoommates",
        blank=True,
    )

    # colocathlon fields
    colocathlon_agree = models.BooleanField(
        verbose_name="Participation au colocathlon",
        default=False,
    )
    colocathlon_quota = models.IntegerField(
        verbose_name="Quantité max d'invités",
        default=0,
    )
    colocathlon_hours = models.CharField(
        verbose_name="Horaires d'ouvertures",
        max_length=50,
        null=True,
        blank=True,
    )
    colocathlon_activities = models.CharField(
        verbose_name="Activités proposées",
        max_length=250,
        null=True,
        blank=True,
    )
    colocathlon_participants = models.ManyToManyField(
        to=Student,
        related_name="colocathlons_in",
        blank=True,
    )

    class Meta:
        verbose_name = "coloc"

    def occupied(self):
        td = timezone.now().today
        if self.begin_date <= td and (
            self.end_date is None or self.end_date >= td
        ):
            return True
        return False


class NamedMembershipRoommates(NamedMembership):
    group = models.ForeignKey(to=Roommates, on_delete=models.CASCADE)
    nickname = models.CharField(
        max_length=100,
        verbose_name="Surnom",
        blank=True,
        null=True,
    )

    def __str__(self):
        if self.nickname:
            return f"{self.nickname} ({self.student.name})"
        else:
            return self.student.name
