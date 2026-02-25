from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.account.models import User
from apps.post.models import AbstractPublication


class Event(AbstractPublication):
    """Extends the Publication model to an Event model."""

    start_date = models.DateTimeField(
        verbose_name=_("Start date"),
        help_text=_("Enter date in format DD/MM/YYYY HH:MM"),
    )
    end_date = models.DateTimeField(
        verbose_name=_("End date"),
        help_text=_("Enter date in format DD/MM/YYYY HH:MM"),
    )
    location = models.CharField(
        verbose_name=_("Location"),
        max_length=200,
        blank=True,
    )
    participants = models.ManyToManyField(
        to=User,
        verbose_name=_("Participants"),
        blank=True,
        related_name="participating_events",
    )
    bookmarks = models.ManyToManyField(
        to=User,
        verbose_name=_("Bookmarks"),
        blank=True,
        help_text=_("Users who have bookmarked this event."),
        related_name="bookmarked_events",
    )
    form_url = models.URLField(
        verbose_name=_("Link to external form"),
        max_length=200,
        blank=True,
    )
    max_participant = models.PositiveIntegerField(
        verbose_name=_("Maximum number of participants"),
        blank=True,
        null=True,
    )
    start_registration = models.DateTimeField(
        verbose_name=_("Start date for registration"),
        blank=True,
        null=True,
        help_text=_("Users cannot register before this date."),
    )
    end_registration = models.DateTimeField(
        verbose_name=_("End date for registration"),
        blank=True,
        null=True,
        help_text=_("Users cannot register after this date."),
    )

    @property
    def number_of_participants(self) -> int:
        return self.participants.all().count()

    def get_absolute_url(self) -> str:
        return f"/event/{self.id}"

    def save(self, *args, **kwargs) -> None:
        # set end date to 1 hour after begin date if not set
        if self.end_date is None:
            self.end_date = self.start_date + timezone.timedelta(hours=1)
        super().save(*args, notification_body=f"Event : {self.title}", **kwargs)
