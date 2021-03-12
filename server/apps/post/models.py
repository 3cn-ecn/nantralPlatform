from datetime import datetime

from django.db import models
from django.db.models.fields import DateTimeField
from django.utils.text import slugify

from apps.group.models import Group
from apps.utils.upload import PathAndRename


path_and_rename = PathAndRename("posts/pictures")

VISIBILITY = [
    ('Pub', 'Public - Visible par tous'),
    ('Mem', 'Membres uniquement - Visible uniquement par les membres du groupe')
]

COLORS = [
    ('primary', 'Bleu'),
    ('success', 'Vert'),
    ('danger', 'Rouge'),
    ('warning', 'Jaune'),
    ('secondary', 'Gris'),
    ('dark', 'Noir')
]


class AbstractPost(models.Model):
    publication_date = models.DateTimeField(
        verbose_name="Date de publication", default=datetime.now())
    title = models.CharField(
        max_length=200, verbose_name='Titre de l\'annonce')
    description = models.TextField(verbose_name='Texte de l\'annonce')
    group = models.SlugField(verbose_name='Groupe publiant l\'annonce')
    slug = models.SlugField(
        verbose_name='Slug de l\'annonce', unique=True, null=True)
    color = models.CharField(max_length=200, verbose_name='Couleur de fond',
                             choices=COLORS, null=True, default='primary')
    publicity = models.CharField(
        max_length=200, verbose_name='Visibilité de l\'annonce', choices=VISIBILITY)
    image = models.ImageField(verbose_name="Une image, une affiche en lien ?",
                              upload_to=path_and_rename, null=True, blank=True)

    class Meta:
        abstract = True


class Post(AbstractPost):

    @property
    def get_group(self):
        return Group.get_group_by_slug(self.group)

    def save(self, *args, **kwargs):
        self.slug = f'post--{slugify(self.title)}-{self.date.year}-{self.date.month}-{self.date.day}'
        super(Post, self).save(*args, **kwargs)
