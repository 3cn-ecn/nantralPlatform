from django.db import models

from .validators import validate_uri


class SocialNetwork(models.Model):
    name = models.CharField(verbose_name="Nom", max_length=20, unique=True)
    color = models.CharField(
        verbose_name="Couleur en hexadécimal avec #",
        max_length=7,
    )
    icon_name = models.CharField(
        verbose_name="Nom Bootstrap de l'icône",
        max_length=40,
    )

    class Meta:
        verbose_name = "Réseau Social"
        verbose_name_plural = "Réseaux Sociaux"

    def __str__(self):
        return self.name


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
    network = models.ForeignKey(
        SocialNetwork,
        on_delete=models.CASCADE,
        verbose_name="Type du lien",
    )
    slug = models.SlugField(verbose_name="Slug du groupe", null=True)  # noqa: DJ001

    class Meta:
        verbose_name = "Lien de Réseau Social"
        verbose_name_plural = "Liens des Réseaux Sociaux"

    def __str__(self):
        return self.uri
