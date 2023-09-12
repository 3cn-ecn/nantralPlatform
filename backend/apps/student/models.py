from django.apps import apps
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.utils.compress import compress_model_image
from apps.utils.upload import PathAndRename

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

path_and_rename = PathAndRename("students/profile_pictures")

User = get_user_model()


class Student(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )
    promo = models.IntegerField(
        verbose_name="Année de promotion entrante", null=True, blank=True
    )
    picture = models.ImageField(
        verbose_name="Photo de profil",
        upload_to=path_and_rename,
        null=True,
        blank=True,
    )
    faculty = models.CharField(
        max_length=200, verbose_name="Filière", choices=FACULTIES
    )
    path = models.CharField(
        max_length=200,
        verbose_name="Cursus",
        choices=PATHS,
        null=True,
        blank=True,
    )

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

    def __str__(self):
        return self.alphabetical_name

    # Don't make this a property, Django expects it to be a method.
    # Making it a property can cause a 500 error (see issue #553).
    def get_absolute_url(self) -> str:
        return f"/student/{self.pk}"

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

    def save(self, *args, **kwargs):
        self.picture = compress_model_image(self, "picture")
        super(Student, self).save(*args, **kwargs)

    class Meta:
        ordering = ["user__last_name", "user__first_name"]


@receiver(post_save, sender=User)
def update_student_signal(sender, instance, created, **kwargs):
    if not instance.is_superuser:
        if created:
            Student.objects.create(user=instance)
        instance.student.save()
