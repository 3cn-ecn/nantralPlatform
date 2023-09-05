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
from django.contrib.auth import get_user_model

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

User = get_user_model()


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

    def save(
        self,
        *args,
        notification_body: str,
        **kwargs
    ) -> None:
        # compression des images
        self.image = compress_model_image(
            self, 'image', size=(960, 540), contains=True)
        # create the notification object
        if not self.notification:
            self.notification = Notification.objects.create(
                title=self.group.name,
                body=notification_body,
                url="",
                sender=self.group.slug)
            NotificationAction.objects.create(
                notification=self.notification,
                title="Ouvrir",
                url=self.notification.url)
            NotificationAction.objects.create(
                notification=self.notification,
                title="Gérer",
                url=reverse("notification:settings"))

        # save the object
        super(AbstractPublication, self).save(*args, **kwargs)

        # update the notification (after saving, to use the id in url)
        n = self.notification
        n.title = self.group.name
        n.body = notification_body
        n.url = self.get_absolute_url()
        n.sender = self.group.slug
        n.icon_url = (self.group.icon.url if self.group.icon else None)
        n.image_url = (self.image.url if self.image else None)
        n.publicity = self.publicity
        n.save()
        # send the notification
        if not self.notification.sent:
            self.notification.send()

    def __str__(self) -> str:
        return f"{self.title} ({self.group.short_name})"

    def can_view(self, user: User) -> bool:
        if self.publicity == 'Pub':
            return True
        return self.group.is_member(user)

    def delete(self, *args, **kwargs):
        if self.notification:
            self.notification.delete()
        return super().delete(*args, **kwargs)

    def get_absolute_url(self) -> str:
        raise NotImplementedError(self.get_absolute_url)


class Post(AbstractPublication):
    pinned = models.BooleanField(
        verbose_name=_("Pin publication"), default=False)

    def save(self, *args, **kwargs) -> None:
        super(Post, self).save(
            *args,
            notification_body=f'Annonce : {self.title}',
            **kwargs
        )

    def get_absolute_url(self) -> str:
        return f'/?post={self.pk}'
