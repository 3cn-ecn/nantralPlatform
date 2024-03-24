from collections import OrderedDict

from django.db.models.signals import post_save

import factory
from factory.django import DjangoModelFactory

from apps.account.factories import UserFactory

from .models import FACULTIES, PATHS, Student


@factory.django.mute_signals(post_save)  # Use this because OneToOneField
class StudentFactory(DjangoModelFactory):
    class Meta:
        model = Student
        skip_postgeneration_save = True

    user = factory.SubFactory(UserFactory, student=None)
    promo = factory.Faker("year")
    faculty = factory.Faker(
        "random_element",
        elements=OrderedDict(
            (key, 10 if key == "Gen" else 1) for key, _ in FACULTIES
        ),
    )
    path = factory.Faker(
        "random_element",
        elements=OrderedDict(
            (key, 10 if key == "Cla" else 1) for key, _ in PATHS
        ),
    )

    @factory.post_generation
    def set_path(self, create, extracted, **kwargs):
        if self.faculty != "Gen":
            # Force path to "Classic" if student is not a Generalist Engineer
            self.path = "Cla"
            if create:
                self.save()
