from django.db import models

from .validators import validate_uri


class SocialLink(models.Model):
    uri = models.CharField(
        verbose_name="URI",
        max_length=200,
        validators=[validate_uri],
    )
    label = models.CharField(
        verbose_name="Étiquette",
        max_length=20,
        blank=True,
    )

    class Meta:
        verbose_name = "Lien de Réseau Social"
        verbose_name_plural = "Liens des Réseaux Sociaux"

    def __str__(self):
        return self.uri
