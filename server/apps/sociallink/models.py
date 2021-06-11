from django.db import models


class SocialNetwork(models.Model):
    name = models.CharField(verbose_name='Nom', max_length=20)
    color = models.CharField(
        verbose_name='Couleur en hexadécimal', max_length=7)
    icon_name = models.CharField(
        verbose_name="Nom Bootstrap de l'icône", max_length=20)

    class Meta:
        verbose_name = "Réseau Social"
        verbose_name_plural = "Réseaux Sociaux"

    def __str__(self):
        return self.name


class SocialLink(models.Model):
    url = models.CharField(verbose_name='URL', max_length=200)
    reseau = models.ForeignKey(SocialNetwork, on_delete=models.CASCADE)
    group = models.SlugField()

    def __str__(self):
        return self.url
