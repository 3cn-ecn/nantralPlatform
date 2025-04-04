from django.apps import apps
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models

from apps.utils.fields.image_field import CustomImageField

FACULTIES = [
    ("Gen", "Ingénieur Généraliste"),
    ("Iti", "Ingénieur de Spécialité (ITII)"),
    ("Mas", "Master"),
    ("Doc", "Doctorat"),
    ("Bac", "Bachelor"),
    ("MSp", "Mastère Spécialisé"),
]

PATHS = [
    ("Cla", ""),
    ("Alt", "Alternance"),
    ("I-A", "Ingénieur-Architecte"),
    ("A-I", "Architecte-Ingénieur"),
    ("I-M", "Ingénieur-Manager"),
    ("M-I", "Manager-Ingénieur"),
    ("I-O", "Ingénieur-Officier"),
    ("O-I", "Officier-Ingénieur"),
]

User = get_user_model()


class Student(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )
    promo = models.IntegerField(
        verbose_name="Année de promotion entrante",
        null=True,
        blank=True,
    )
    picture = CustomImageField(
        verbose_name="Photo de profil",
        null=True,
        blank=True,
        size=(500, 500),
        crop=True,
        name_from_field="user",
    )
    faculty = models.CharField(
        max_length=200,
        verbose_name="Filière",
        choices=FACULTIES,
    )
    path = models.CharField(  # noqa: DJ001
        max_length=200,
        verbose_name="Cursus",
        choices=PATHS,
        null=True,
        blank=True,
    )

    class Meta:
        ordering = ["user__last_name", "user__first_name"]

    def __str__(self):
        return self.alphabetical_name

    def get_absolute_url(self) -> str:
        return f"/student/{self.pk}"

    @property
    def name(self):
        """Renvoie le nom de l'utilisateur au format Prénom NOM."""
        if self.user.first_name and self.user.last_name:
            return (
                f"{self.user.first_name.title()} {self.user.last_name.upper()}"
            )
        elif self.user.first_name:
            return self.user.first_name.title()
        elif self.user.last_name:
            return self.user.last_name.title()
        else:
            return self.user.username

    @property
    def alphabetical_name(self):
        """Renvoie le nom de l'utilisateur au format NOM Prénom."""
        if self.user.first_name and self.user.last_name:
            return (
                f"{self.user.last_name.upper()} {self.user.first_name.title()}"
            )
        else:
            return self.name

    def can_pin(self) -> bool:
        # to avoid circular import
        membership = apps.get_model("group.Membership")
        return (
            membership.objects.filter(
                student=self,
                admin=True,
                group__can_pin=True,
                group__archived=False,
            ).exists()
            or self.user.is_superuser
        )

    def delete(self, *args, **kwargs):
        self.picture.delete()
        super().delete(*args, **kwargs)
