from django.db import models
from django.shortcuts import get_object_or_404
from django.utils import timezone

from apps.account.models import User
from apps.group.models import Group

from .webpush import send_webpush_notification

# How notifications work:
# -----------------------
# In the notifications menu, we see all notifications.
# Only notifications in the "Subscription" tab are sent to the device.
# By default, no subscription, so no notification, except the high-priority ones.
# We only subscribe to groups.
# All notifications are sent by a group.

VISIBILITY = [
    ("Pub", "Public - Visible par tous"),
    ("Mem", "Membres - Visible uniquement par les membres du groupe"),
    ("Adm", "Administrateurs de la page"),
]


class Notification(models.Model):
    """Contenu d'une notification."""

    title = models.CharField("Titre", max_length=255)
    body = models.CharField("Corps", max_length=512)
    url = models.CharField("Cible", max_length=512)
    sender = models.SlugField("Expéditeur", max_length=50)
    icon_url = models.CharField(max_length=512, blank=True)
    image_url = models.CharField(max_length=512, blank=True)
    date = models.DateTimeField("Date de création", default=timezone.now)
    high_priority = models.BooleanField("Prioritaire", default=False)
    publicity = models.CharField(
        choices=VISIBILITY,
        default="Pub",
        max_length=3,
        verbose_name="Visibilité de la notification",
    )
    receivers = models.ManyToManyField(
        User,
        related_name="notification_set",
        through="SentNotification",
    )
    sent = models.BooleanField("Envoyé", default=False)

    def __str__(self):
        return f"{self.title} - {self.body}"[:100]

    def save(self, *args, **kwargs):
        """Save, and then get the list of all profiles who can see the post, and
        update high_priority field for notification"""
        super().save(*args, **kwargs)
        # initiate
        page = get_object_or_404(Group, slug=self.sender)
        receivers = User.objects.none()
        # if receivers are everyone
        if self.publicity == "Pub":
            receivers = User.objects.all()
        # if receivers are only members
        elif self.publicity == "Mem":
            self.high_priority = True
            if hasattr(page, "members"):
                receivers = page.members.all()
        # if receivers are only administrators
        elif self.publicity == "Adm":
            self.high_priority = True
            if hasattr(page, "members"):
                receivers = page.members.through.objects.filter(
                    group=page,
                    admin=True,
                )
        self.receivers.add(*receivers)
        # then we update the subscribed field for receivers who have subscribed
        if self.high_priority:
            sub_receivers = self.receivers.all()
        else:
            sub_receivers = self.receivers.filter(
                subscriptions__slug=self.sender,
            )
        SentNotification.objects.filter(
            user__in=sub_receivers,
            notification=self,
        ).update(subscribed=True)
        # finally we save again because we updated the high_priority field
        super().save()

    def send(self):
        """Save the notification and add recipients."""
        # select the receivers who have subscribed and will receive the
        # notification
        sub_receivers = self.receivers.filter(sentnotification__subscribed=True)
        # then create the message
        message = {
            "title": self.title,
            "body": self.body,
            "data": {
                "url": self.url,
                "actions_url": [action.url for action in self.actions.all()],
            },
            "icon": self.icon_url,
            "image": self.image_url,
            "badge": "/static/img/logo/monochrome/96.png",
            "tag": self.id,
            "actions": [
                {
                    "action": f"action_{i}",
                    "title": action.title,
                    "icon": action.icon_url,
                }
                for i, action in enumerate(self.actions.all())
            ],
        }
        # finally send the message to the subscribed receivers and get the
        # success value to know if the task has been successfully launched
        send_webpush_notification(sub_receivers, message)
        # update the notification to register it has been sent
        self.sent = True
        self.save()

    @property
    def nb_targets(self):
        return self.sentnotification_set.count()


class SentNotification(models.Model):
    """Table des notifications envoyées à chaque utilisateur."""

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE)
    seen = models.BooleanField("Vu", default=False)
    subscribed = models.BooleanField(
        "Abonné",
        default=False,
        help_text="Vrai si on la montre dans les abonnements",
    )

    class Meta:
        verbose_name = "Notification envoyée"
        verbose_name_plural = "Notifications envoyées"
        unique_together = ["user", "notification"]

    @property
    def date(self):
        return self.notification.date


class NotificationAction(models.Model):
    """An action for a notification."""

    notification = models.ForeignKey(
        Notification,
        on_delete=models.CASCADE,
        related_name="actions",
    )
    title = models.CharField("Titre", max_length=50)
    url = models.CharField("Cible", max_length=512)
    icon_url = models.CharField(
        "Url of the icon for the action",
        max_length=512,
        blank=True,
    )
