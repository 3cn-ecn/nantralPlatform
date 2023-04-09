from django.db import models
from django.utils import timezone

from django.shortcuts import get_object_or_404, reverse
from django.contrib.auth.models import User

from django_ckeditor_5.fields import CKEditor5Field

from apps.utils.slug import SlugModel
from apps.utils.upload import PathAndRename
from apps.utils.compress import compress_model_image
from apps.group.models import Group
from apps.notification.models import Notification, NotificationAction
from apps.student.models import Student

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


class AbstractPost(models.Model, SlugModel):
    publication_date = models.DateTimeField(
        verbose_name="Date de publication",
        default=timezone.now,
        help_text="Entrez la date au format JJ/MM/AAAA HH:MM")
    title = models.CharField(
        max_length=200, verbose_name='Titre de l\'annonce')
    group = models.ForeignKey(
        Group, verbose_name="Organisateur", on_delete=models.CASCADE)
    description = CKEditor5Field(
        verbose_name='Texte de l\'annonce', blank=True)
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
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        Student, blank=True, null=True,
        on_delete=models.SET_NULL, related_name='+')

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        # compression des images
        self.image = compress_model_image(
            self, 'image', size=(960, 540), contains=True)
        # save the notification
        # self.create_notification(
        #     title=self.group.name,
        #     body=self.title)
        # send the notification
        if self.notification and not self.notification.sent:
            self.notification.send()
        super(AbstractPost, self).save(*args, **kwargs)

    def can_view(self, user: User) -> bool:
        if self.publicity == VISIBILITY[0][0]:
            return True
        return self.group.is_member(user)

    def create_notification(self, title, body, url):
        """Create a new notification for this post"""
        # create or get the notification linked to this post
        if self.notification:
            return
        self.notification = Notification.objects.create(
            title=title,
            body=body,
            url=url,
            sender=self.group.slug,
            date=self.publication_date,
            icon_url=(self.group.icon.url
                      if self.group.icon else None),
            publicity=self.publicity
        )
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
        if self.notification:
            self.notification.delete()
        return super().delete(*args, **kwargs)


class Post(AbstractPost):
    page_suggestion = models.URLField(
        verbose_name="Suggestion de page",
        null=True, blank=True,
        help_text="Lien vers une page web")
    pinned = models.BooleanField(
        verbose_name="Épinglé", default=False)

    def save(self, *args, **kwargs):
        # create the slug
        d = self.publication_date
        self.set_slug(
            f'{d.year}-{d.month}-{d.day}-{self.title}'
        )
        # save agin the post
        super(Post, self).save(*args, **kwargs)
        self.create_notification(
            body=f'Nouveau Post : {self.title}',
            title=self.group.name,
            url=self.get_absolute_url())

    # Don't make this a property, Django expects it to be a method.
    # Making it a property can cause a 500 error (see issue #553).
    def get_absolute_url(self):
        return f'/?post={self.pk}'

    def __str__(self) -> str:
        return self.group.name + " - " + self.title

    @staticmethod
    def get_post_by_slug(slug: str):
        """Get a group from a slug."""
        return get_object_or_404(Post, slug=slug)
