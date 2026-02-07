from django.db import models
from django.shortcuts import reverse
from django.utils.translation import gettext_lazy as _

from django_ckeditor_5.fields import CKEditor5Field

from apps.account.models import User
from apps.group.models import Group
from apps.notification.models import Notification, NotificationAction
from apps.utils.fields.image_field import CustomImageField
from apps.utils.slug import SlugModel

VISIBILITY = [
    ("Pub", "Public - Visible par tous"),
    (
        "Mem",
        "Membres uniquement - Visible uniquement par les membres du groupe",
    ),
]

COLORS = [
    ("primary", "Bleu"),
    ("success", "Vert"),
    ("danger", "Rouge"),
    ("warning", "Jaune"),
    ("secondary", "Gris"),
    ("dark", "Noir"),
]


class AbstractPublication(models.Model, SlugModel):
    """Abstract model for posts and events."""

    title = models.CharField(verbose_name=_("Title"), max_length=200)
    description = CKEditor5Field(verbose_name=_("Description"), blank=True)
    group = models.ForeignKey(
        to=Group,
        verbose_name=_("Organiser"),
        on_delete=models.CASCADE,
    )
    publicity = models.CharField(
        verbose_name=_("Visibility"),
        max_length=200,
        choices=VISIBILITY,
    )
    image = CustomImageField(
        verbose_name=_("Banner"),
        null=True,
        blank=True,
        help_text=_("Your banner will be displayed with a 16/9 ratio."),
        size=(1280, 720),
        name_from_field="title",
    )
    notification = models.ForeignKey(
        to=Notification,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )

    # Log infos
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        User,
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        User,
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    class Meta:
        abstract = True

    def __str__(self) -> str:
        return f"{self.title} ({self.group.short_name})"

    def save(self, *args, notification_body: str, **kwargs) -> None:
        # create the notification object
        if not self.notification:
            self.notification = Notification.objects.create(
                title=self.group.name,
                body=notification_body,
                url="",
                sender=self.group.slug,
                publicity=self.publicity,
            )
            NotificationAction.objects.create(
                notification=self.notification,
                title="Ouvrir",
                url=self.notification.url,
            )
            NotificationAction.objects.create(
                notification=self.notification,
                title="Gérer",
                url=reverse("notification:settings"),
            )

        # save the object
        super().save(*args, **kwargs)

        # update the notification (after saving, to use the id in url)
        n = self.notification
        n.title = self.group.name
        n.body = notification_body
        n.url = self.get_absolute_url()
        n.sender = self.group.slug
        n.icon_url = self.group.icon.url if self.group.icon else ""
        n.image_url = self.image.url if self.image else ""
        n.publicity = self.publicity
        n.save()
        # send the notification
        if not self.notification.sent:
            self.notification.send()

    def get_absolute_url(self) -> str:
        raise NotImplementedError(self.get_absolute_url)

    def can_view(self, user: User) -> bool:
        if self.publicity == "Pub":
            return True
        return self.group.is_member(user)

    def delete(self, *args, **kwargs):
        if self.notification:
            self.notification.delete()
        self.image.delete(save=False)
        return super().delete(*args, **kwargs)


class Post(AbstractPublication):
    pinned = models.BooleanField(
        verbose_name=_("Pin publication"),
        default=False,
    )

    def save(self, *args, **kwargs) -> None:
        super().save(
            *args,
            notification_body=f"Annonce : {self.title}",
            **kwargs,
        )

    def get_absolute_url(self) -> str:
        return f"/?post={self.pk}"
