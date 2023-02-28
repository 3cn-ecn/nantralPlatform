from django.db import models
from django.contrib.auth.models import User
from django.shortcuts import reverse

from django_ckeditor_5.fields import CKEditor5Field

from apps.post.models import AbstractPost
from apps.group.models import Group
from apps.student.models import Student
from apps.utils.upload import PathAndRename
from datetime import timedelta

path_and_rename = PathAndRename("events/pictures")


class Event(AbstractPost):
    """
    A basic event model for groups
    """
    title = models.CharField(
        max_length=200, verbose_name='Titre de l\'événement')
    description = CKEditor5Field(
        verbose_name='Description de l\'événement', blank=True)
    date = models.DateTimeField(
        verbose_name='Date de l\'événement',
        help_text="Entrez la date au format JJ/MM/AAAA HH:MM")
    end_date = models.DateTimeField(
        verbose_name='Date de fin de l\'événement',
        help_text='Par défaut une heure après la date de début',
        blank=True,
        null=True)
    group = models.ForeignKey(
        Group, verbose_name="Organisateur", on_delete=models.CASCADE)
    location = models.CharField(
        max_length=200, verbose_name='Lieu')
    slug = models.SlugField(
        verbose_name='Slug de l\'événement', unique=True, null=True)
    participants = models.ManyToManyField(
        to=Student, verbose_name='Participants', blank=True)
    form_url = models.URLField(
        verbose_name='Lien vers la billetterie',
        max_length=200,
        blank=True,
        null=True)
    max_participant = models.IntegerField(
        verbose_name='Nombre de places maximal',
        blank=True,
        null=True
    )
    begin_inscription = models.DateTimeField(
        verbose_name='Date de début de l\'inscription',
        blank=True,
        null=True
    )
    end_inscription = models.DateTimeField(
        verbose_name='Date de fin de l\'inscription',
        blank=True,
        null=True
    )

    @property
    def number_of_participants(self) -> int:
        return self.participants.all().count()

    def is_participating(self, user: User) -> bool:
        if user.is_anonymous or not user.is_authenticated or not hasattr(
                user, 'student'):
            return False
        return user.student in self.participants.all()

    def is_favorite(self, user: User) -> bool:
        if user.is_anonymous or not user.is_authenticated or not hasattr(
                user, 'student'):
            return False
        return user.student.favorite_event.contains(self)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # create the slug
        self.set_slug(
            f'{self.date.year}-{self.date.month}-{self.date.day}-{self.title}'
        )
        if (self.form_url == ""):
            self.form_url = None
        # set end date to 1 hour after begin date if not set
        if (self.end_date is None):
            self.end_date = self.date + timedelta(hours=1)
        # save the notification
        self.create_notification(
            title=self.group.name,
            body=f'Nouvel event : {self.title}')
        # save again the event
        super(Event, self).save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('event:detail', args=[self.slug])
