from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

from apps.post.models import AbstractPublication
from apps.student.models import Student
from apps.utils.upload import PathAndRename

path_and_rename = PathAndRename("events/pictures")


class Event(AbstractPublication):
    """Extends the Publication model to an Event model."""

    start_date = models.DateTimeField(
        verbose_name=_("Start date of the event"),
        help_text=_("Enter date in format DD/MM/YYYY HH:MM"))
    end_date = models.DateTimeField(
        verbose_name=_("End date of the event"),
        help_text=_("If empty, default to one hour after the start date."),
        blank=True)
    location = models.CharField(
        verbose_name=_("Location"), max_length=200, blank=True, null=True)
    participants = models.ManyToManyField(
        to=Student,
        verbose_name=_("Participants"),
        blank=True,
        related_name='participate_events')
    bookmarks = models.ManyToManyField(
        to=Student,
        verbose_name=_("Bookmarks"),
        blank=True,
        help_text=_("Users who have bookmarked this event."),
        related_name='bookmarked_events')
    form_url = models.URLField(
        verbose_name=_("Link to external form"),
        max_length=200,
        blank=True)
    max_participant = models.PositiveIntegerField(
        verbose_name=_("Maximum number of participants"),
        blank=True,
        null=True)
    start_registration = models.DateTimeField(
        verbose_name=_("Start date for registration"),
        blank=True,
        null=True,
        help_text=_("Users cannot register before this date."))
    end_registration = models.DateTimeField(
        verbose_name=_("End date for registration"),
        blank=True,
        null=True,
        help_text=_("Users cannot register after this date."))

    @property
    def number_of_participants(self) -> int:
        return self.participants.all().count()

    def is_participating(self, user: User) -> bool:
        return (user.is_authenticated
                and self.participants.contains(user.student))

    def is_bookmarked(self, user: User) -> bool:
        return (user.is_authenticated
                and self.bookmarks.contains(user.student))

    def get_absolute_url(self) -> str:
        return f'/event/{self.id}'

    def save(self, *args, **kwargs) -> None:
        # set end date to 1 hour after begin date if not set
        if self.end_date is None:
            self.end_date = self.date + timezone.timedelta(hours=1)
        # save the event
        super(Event, self).save(*args, **kwargs)
        # save the notification
        self.create_notification(
            title=self.group.name,
            body=f'Nouvel event : {self.title}',
            url=self.get_absolute_url())
