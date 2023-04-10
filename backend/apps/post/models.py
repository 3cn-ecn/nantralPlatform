from django.contrib.auth.models import User
from django.db import models
from django.shortcuts import reverse
from django.utils.translation import gettext_lazy as _

from django_ckeditor_5.fields import CKEditor5Field

from apps.group.models import Group
from apps.notification.models import Notification, NotificationAction
from apps.student.models import Student
from apps.utils.compress import compress_model_image
from apps.utils.slug import SlugModel
from apps.utils.upload import PathAndRename

path_and_rename = PathAndRename('posts/pictures')

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


class AbstractPublication(models.Model, SlugModel):
    """Abstract model for posts and events."""
    title = models.CharField(
        verbose_name=_("Title"), max_length=200)
    description = CKEditor5Field(
        verbose_name=_("Description"), blank=True)
    group = models.ForeignKey(
        to=Group,
        verbose_name=_("Organiser"),
        on_delete=models.CASCADE)
    publicity = models.CharField(
        verbose_name=_("Visibility"),
        max_length=200,
        choices=VISIBILITY)
    image = models.ImageField(
        verbose_name=_("Banner"),
        upload_to=path_and_rename,
        null=True,
        blank=True,
        help_text=_("Your banner will be displayed at 1320x492 pixels."))
    notification = models.ForeignKey(
        to=Notification, on_delete=models.SET_NULL, blank=True, null=True)

    # Log infos
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        Student, blank=True, null=True,
        on_delete=models.SET_NULL, related_name='+')
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        Student, blank=True, null=True,
        on_delete=models.SET_NULL, related_name='+')

    class Meta:
        abstract = True

    def save(self, *args, **kwargs) -> None:
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
        super(AbstractPublication, self).save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.title} ({self.group.short_name})"

    def can_view(self, user: User) -> bool:
        if self.publicity == VISIBILITY[0][0]:
            return True
        return self.group.is_member(user)

    def create_notification(self, title: str, body: str, url: str) -> None:
        """Create a new notification for this post"""
        # create or get the notification linked to this post
        if self.notification:
            return
        self.notification = Notification.objects.create(
            title=title,
            body=body,
            url=url,
            sender=self.group.slug,
            date=self.created_at,
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

    def delete(self, *args, **kwargs):
        if self.notification:
            self.notification.delete()
        return super().delete(*args, **kwargs)


class Post(AbstractPublication):
    pinned = models.BooleanField(
        verbose_name=_("Pin publication"), default=False)

    def save(self, *args, **kwargs) -> None:
        # save again the post
        super(Post, self).save(*args, **kwargs)
        self.create_notification(
            body=f'Nouveau Post : {self.title}',
            title=self.group.name,
            url=self.get_absolute_url())

    def get_absolute_url(self) -> str:
        return f'/?post={self.pk}'
