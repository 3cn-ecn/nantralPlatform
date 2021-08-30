from django.db import models
from django.utils.text import slugify
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
    date = models.DateTimeField(verbose_name='Date de l\'événement')
    location = models.CharField(max_length=200, verbose_name='Lieu')
    group = models.SlugField(verbose_name='Groupe organisateur')
    slug = models.SlugField(
        verbose_name='Slug de l\'événement', unique=True, null=True)
    participants = models.ManyToManyField(
        to=Student, verbose_name='Participants', blank=True)
    ticketing = models.CharField(
        verbose_name='Lien vers la billeterie', blank=True, max_length=200, null=True)

    @property
    def number_of_participants(self) -> int:
        return self.participants.all().count()

    def is_participating(self, user: User) -> bool:
        student = Student.objects.filter(user=user).first()
        return student in self.participants.all()

    def save(self, *args, **kwargs):
        self.slug = f'bevent--{slugify(self.title)}-{self.date.year}-{self.date.month}-{self.date.day}'
        super(BaseEvent, self).save(*args, **kwargs)

    @property
    def get_absolute_url(self):
        return reverse('event:detail', args=[self.slug])

    @staticmethod
    def get_event_by_slug(slug: str):
        type_slug = slug.split('--')[0]
        if type_slug == 'bevent':
            return get_object_or_404(BaseEvent, slug=slug)
        elif type_slug == 'eevent':
            return EatingEvent.objects.get(slug=slug)


class EatingEvent(BaseEvent):
    """
    Events that features meals.
    They can show a menu, ask people about their eating habbits...
    """
    menu = models.TextField(verbose_name='Menu de l\'événement')

    def save(self, *args, **kwargs):
        self.slug = f'eevent--{slugify(self.title)}'
        super(EatingEvent, self).save(*args, **kwargs)
