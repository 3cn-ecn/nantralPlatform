from django.db import models
from django.contrib.auth.models import User
from django.shortcuts import reverse

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

    @property
    def number_of_participants(self) -> int:
        return self.participants.all().count()

    def is_participating(self, user: User) -> bool:
        student = Student.objects.filter(user=user).first()
        return student in self.participants.all()

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
        super(BaseEvent, self).save(*args, **kwargs)

    # Don't make this a property, Django expects it to be a method.
    # Making it a property can cause a 500 error (see issue #553).

    def get_absolute_url(self):
        return reverse('event:detail', args=[self.slug])
