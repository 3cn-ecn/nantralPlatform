from django.db import models
from django.contrib.auth.models import User
from django.shortcuts import reverse, get_object_or_404

from django_ckeditor_5.fields import CKEditor5Field

from apps.post.models import AbstractPost
from apps.student.models import Student
from apps.utils.upload import PathAndRename


path_and_rename = PathAndRename("events/pictures")


class BaseEvent(AbstractPost):
    """
    A basic event model for groups
    """
    title = models.CharField(
        max_length=200, verbose_name='Titre de l\'événement')
    description = CKEditor5Field(
        verbose_name='Description de l\'événement', blank=True)
    date = models.DateTimeField(
        verbose_name='Date de l\'événement')
    end_date = models.DateTimeField(
        verbose_name='Date de fin de l\'événement',
        blank=True,
        null=True)
    location = models.CharField(
        max_length=200, verbose_name='Lieu')
    group = models.SlugField(
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
        if user is None:
            return False
        student = user.student
        return self.participants.contains(student)

    def is_favorite(self, user: User) -> bool:
        student = user.student
        if (student is None):
            return False
        return student.favorite_event.contains(self)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # create the slug
        self.set_slug(
            f'{self.date.year}-{self.date.month}-{self.date.day}-{self.title}'
        )
        # save the notification
        self.create_notification(
            title=self.get_group_name,
            body=f'Nouvel event : {self.title}')
        # save again the event
        super(BaseEvent, self).save(*args, **kwargs)

    # Don't make this a property, Django expects it to be a method.
    # Making it a property can cause a 500 error (see issue #553).

    def get_absolute_url(self):
        return reverse('event:detail', args=[self.slug])

    @staticmethod
    def get_event_by_slug(slug: str):
        object = get_object_or_404(BaseEvent, slug=slug)
        try:
            object = object.eatingevent
        except EatingEvent.DoesNotExist:
            pass
        return object


class EatingEvent(BaseEvent):
    """
    Events that features meals.
    They can show a menu, ask people about their eating habbits...
    """
    menu = models.TextField(verbose_name='Menu de l\'événement')
