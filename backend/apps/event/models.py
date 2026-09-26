from datetime import datetime, timedelta
from enum import IntEnum

from django.conf import settings
from django.db import models, transaction
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.account.models import User
from apps.group.models import Group
from apps.post.models import AbstractPublication


class SportEventType(IntEnum):
    """Enumeration for sport event types."""

    TRAINING = 1
    COMPETITION = 2

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]


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


MAX_SPORT_EVENT_OCCURRENCES = 52


def _local_naive(value: datetime) -> datetime:
    """Convert an aware datetime to a naive datetime in local time."""
    return timezone.localtime(value).replace(tzinfo=None)


def shift_in_local_time(value: datetime, delta: timedelta) -> datetime:
    """Shift a datetime by `delta`, computed in local time.

    This keeps the same wall-clock time across daylight saving time changes
    (e.g. an event at 18:00 stays at 18:00 after the switch to winter time).
    """
    return timezone.make_aware(_local_naive(value) + delta)


def weekly_dates(
    start: datetime,
    until: datetime,
    limit: int | None = None,
) -> list[datetime]:
    """Return the weekly dates from `start` (included) up to `until`.

    If `limit` is given, stop after `limit + 1` dates (enough to know that
    the limit is exceeded without iterating over a huge range).
    """
    dates = []
    current = start
    while current <= until and (limit is None or len(dates) <= limit):
        dates.append(current)
        current = shift_in_local_time(start, timedelta(weeks=len(dates)))
    return dates


class SportEvent(models.Model):
    """A model representing a sport event.

    A sport event can be recurrent: occurrences are chained through the
    `parent` field (each occurrence points to the previous one). Updating an
    occurrence propagates the shared fields (and the date shift) to all of
    its descendants, and deleting it deletes all of its descendants.
    """

    description = models.TextField(
        verbose_name=_("Description"),
        blank=True,
    )
    owner = models.ForeignKey(
        to=Group,
        on_delete=models.CASCADE,
        verbose_name=_("Groupe"),
    )
    date = models.DateTimeField(
        verbose_name=_("Date"),
    )
    location = models.CharField(
        verbose_name=_("Location"),
        max_length=200,
        blank=True,
    )
    type = models.PositiveSmallIntegerField(
        verbose_name=_("Type"),
        choices=SportEventType.choices(),
        default=SportEventType.TRAINING,
    )
    participants = models.ManyToManyField(
        to=User,
        verbose_name=_("Participants"),
        blank=True,
        related_name="participating_sport_events",
    )
    non_participants = models.ManyToManyField(
        to=User,
        verbose_name=_("Non-participants"),
        blank=True,
        related_name="non_participating_sport_events",
    )
    parent = models.OneToOneField(
        to="self",
        on_delete=models.CASCADE,
        verbose_name=_("Previous occurrence"),
        null=True,
        blank=True,
        related_name="child",
    )

    def __str__(self) -> str:
        return self.description

    def save(self, *args, propagate: bool = True, **kwargs) -> None:
        """Save the event and propagate the changes to its descendants.

        Parameters
        ----------
        propagate : bool
            If False, only save this occurrence.
        """
        if not propagate or self._state.adding:
            super().save(*args, **kwargs)
            return
        with transaction.atomic():
            previous_date = (
                SportEvent.objects.filter(pk=self.pk)
                .values_list("date", flat=True)
                .first()
            )
            super().save(*args, **kwargs)
            date_shift = (
                _local_naive(self.date) - _local_naive(previous_date)
                if previous_date is not None
                else timedelta(0)
            )
            child = self.get_child()
            while child is not None:
                self.copy_shared_fields_to(child)
                if date_shift:
                    child.date = shift_in_local_time(child.date, date_shift)
                child.save(propagate=False)
                child = child.get_child()

    @staticmethod
    def shared_fields() -> list[str]:
        """Fields copied from an occurrence to its descendants."""
        return [
            "owner_id",
            "location",
            "type",
            *(f"description_{code}" for code, _name in settings.LANGUAGES),
        ]

    def get_child(self) -> "SportEvent | None":
        return getattr(self, "child", None)

    def copy_shared_fields_to(self, other: "SportEvent") -> None:
        for field in self.shared_fields():
            setattr(other, field, getattr(self, field))

    def get_descendants(self) -> list["SportEvent"]:
        """Return the following occurrences, in chronological order."""
        descendants = []
        child = self.get_child()
        while child is not None:
            descendants.append(child)
            child = child.get_child()
        return descendants

    def get_repeat_until(self) -> datetime | None:
        """Return the date of the last occurrence, if there is a following
        occurrence.
        """
        descendants = self.get_descendants()
        return descendants[-1].date if descendants else None

    def set_repeat_until(self, until: datetime | None) -> None:
        """Make this event repeat weekly up to `until`.

        The following occurrences after `until` are deleted, and new weekly
        occurrences are added after the last one if needed. If `until` is
        None, all the following occurrences are deleted.
        """
        with transaction.atomic():
            last = self
            for occurrence in self.get_descendants():
                if until is None or occurrence.date > until:
                    # deletes all the following occurrences too
                    occurrence.delete()
                    break
                last = occurrence
            if until is not None:
                last.repeat_weekly(until)

    def repeat_weekly(self, until: datetime) -> list["SportEvent"]:
        """Create a weekly occurrence of this event up to `until`.

        The occurrences are chained after this event, which must not already
        have a child. The participants are not copied.
        """
        occurrences = []
        previous = self
        with transaction.atomic():
            for date in weekly_dates(self.date, until)[1:]:
                occurrence = SportEvent(parent=previous, date=date)
                self.copy_shared_fields_to(occurrence)
                occurrence.save()
                occurrences.append(occurrence)
                previous = occurrence
        return occurrences

    def delete_single(self) -> None:
        """Delete only this occurrence, linking its child to its parent."""
        with transaction.atomic():
            child = self.get_child()
            parent_id = self.parent_id
            SportEvent.objects.filter(pk=self.pk).update(parent=None)
            if child is not None:
                SportEvent.objects.filter(pk=child.pk).update(
                    parent=parent_id,
                )
            # prevent Django from cascading to the (now detached) child
            SportEvent.objects.filter(pk=self.pk).delete()
