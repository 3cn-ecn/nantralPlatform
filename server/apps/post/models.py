from django.db import models
from django.utils import timezone

from django.utils.text import slugify
from django.shortcuts import get_object_or_404, reverse

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
        verbose_name="Date de publication", default=timezone.now)
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

    @property
    def get_group(self):
        return Group.get_group_by_slug(self.group)


class Post(AbstractPost):

    def save(self, *args, **kwargs):
        self.slug = f'post--{slugify(self.title)}-{self.publication_date.year}-{self.publication_date.month}-{self.publication_date.day}'
        super(Post, self).save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('post:detail', args=[self.slug])

    @staticmethod
    def get_post_by_slug(slug:  str):
        """Get a group from a slug."""
        return get_object_or_404(Post, slug=slug)
