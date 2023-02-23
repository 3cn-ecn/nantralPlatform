from django.db import models
from django.utils import timezone

from django.shortcuts import get_object_or_404, reverse
from django.contrib.auth.models import User

from django_ckeditor_5.fields import CKEditor5Field

from apps.utils.slug import SlugModel
from apps.utils.upload import PathAndRename
from apps.utils.compress import compress_model_image
from apps.group.abstract.models import AbstractGroup
from apps.group.models import Group
from apps.notification.models import Notification, NotificationAction


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

TYPE = [
    ('Content', 'Partage de contenu'),
    ('Suggestion', )
]


class AbstractPost(models.Model, SlugModel):
    publication_date = models.DateTimeField(
        verbose_name="Date de publication",
        default=timezone.now,
        help_text="Entrez la date au format JJ/MM/AAAA HH:MM")
    title = models.CharField(
        max_length=200, verbose_name='Titre de l\'annonce')
    description = CKEditor5Field(
        verbose_name='Texte de l\'annonce', blank=True)
    group_slug = models.SlugField(verbose_name='Groupe publiant l\'annonce')
    slug = models.SlugField(verbose_name='Slug de l\'annonce',
                            unique=True, null=True)
    color = models.CharField(max_length=200, verbose_name='Couleur de fond',
                             choices=COLORS, null=True, default='primary')
    publicity = models.CharField(
        max_length=200,
        verbose_name='Visibilité de l\'annonce',
        choices=VISIBILITY)
    image = models.ImageField(verbose_name="Une image, une affiche en lien ?",
                              upload_to=path_and_rename, null=True, blank=True)
    notification = models.ForeignKey(
        to=Notification, on_delete=models.SET_NULL, blank=True, null=True)

    class Meta:
        abstract = True

    @property
    def group(self) -> AbstractGroup:
        return get_object_or_404(Group, slug=self.group_slug)

    def save(self, *args, **kwargs):
        # compression des images
        self.image = compress_model_image(
            self, 'image', size=(1320, 492), contains=False)
        super(AbstractPost, self).save(*args, **kwargs)
        # send the notification
        if not self.notification.sent:
            self.notification.send()

    def can_view(self, user: User) -> bool:
        if self.publicity == VISIBILITY[0][0]:
            return True
        return self.group.is_member(user)

    def create_notification(self, title, body):
        """Create a new notification for this post"""
        # create or get the notification linked to this post
        if self.notification:
            return
        self.notification = Notification.objects.create(
            title=title,
            body=body,
            url=self.get_absolute_url(),
            sender=self.group_slug,
            date=self.publication_date,
            icon_url=(self.group.icon.url
                      if self.group.icon else None),
            publicity=self.publicity
        )
        # add image
        if self.image:
            self.notification.image_url = self.image.url
            self.notification.save()
        # add actions to the notification
        NotificationAction.objects.create(
            notification=self.notification,
            title="Ouvrir",
            url=self.notification.url
        )
        NotificationAction.objects.create(
            notification=self.notification,
            title="Gérer",
            url=reverse("notification:settings")
        )

    def delete(self, *args, **kwargs) -> tuple[int, dict[str, int]]:
        self.notification.delete()
        return super().delete(*args, **kwargs)


class Post(AbstractPost):

    def save(self, *args, **kwargs):
        # create the slug
        d = self.publication_date
        self.set_slug(
            f'{d.year}-{d.month}-{d.day}-{self.title}'
        )
        # save the notification
        self.create_notification(
            title=self.group.name,
            body=self.title)
        # save agin the post
        super(Post, self).save(*args, **kwargs)

    # Don't make this a property, Django expects it to be a method.
    # Making it a property can cause a 500 error (see issue #553).
    def get_absolute_url(self):
        return reverse('post:detail', args=[self.slug])

    @staticmethod
    def get_post_by_slug(slug: str):
        """Get a group from a slug."""
        return get_object_or_404(Post, slug=slug)
