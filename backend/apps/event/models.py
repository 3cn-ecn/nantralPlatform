from django.db import models
from django.contrib.auth.models import User
from django.shortcuts import reverse

from django_ckeditor_5.fields import CKEditor5Field

from apps.post.models import AbstractPost
from apps.student.models import Student
from apps.utils.upload import PathAndRename


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
        blank=True,
        null=True)
    location = models.CharField(
        max_length=200, verbose_name='Lieu')
    group_slug = models.SlugField(
        verbose_name='Groupe organisateur')
    slug = models.SlugField(
        verbose_name='Slug de l\'événement', unique=True, null=True)
    participants = models.ManyToManyField(
        to=Student, verbose_name='Participants', blank=True)
    ticketing = models.CharField(
        verbose_name='Lien vers la billetterie',
        blank=True,
        max_length=200,
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
        # save the notification
        self.create_notification(
            title=self.group.name,
            body=f'Nouvel event : {self.title}')
        # save again the event
        super(Event, self).save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('event:detail', args=[self.slug])
