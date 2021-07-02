from django.db import models


class SocialNetwork(models.Model):
    name = models.CharField(verbose_name='Nom', max_length=20, unique=True)
    color = models.CharField(
        verbose_name='Couleur en hexadécimal avec #', max_length=7)
    icon_name = models.CharField(
        verbose_name="Nom Bootstrap de l'icône", max_length=40)

    class Meta:
        verbose_name = "Réseau Social"
        verbose_name_plural = "Réseaux Sociaux"

    def __str__(self):
        return self.name


class SocialLink(models.Model):
    url = models.URLField(verbose_name='URL', max_length=200)
    label = models.CharField(verbose_name='Étiquette', max_length=20, null=True, blank=True)
    network = models.ForeignKey(SocialNetwork, on_delete=models.CASCADE)
    slug = models.SlugField(verbose_name='Slug du lien', null=True)

    class Meta:
        verbose_name = "Lien de Réseau Social"
        verbose_name_plural = "Liens des Réseaux Sociaux"
    
    def __str__(self):
        return self.url
