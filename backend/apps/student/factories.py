from collections import OrderedDict

from django.db.models.signals import post_save

import factory
from factory.django import DjangoModelFactory

from apps.account.factories import UserFactory
from apps.utils.fake_data_generator import FakeDataGenerator

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


class StudentFakeData(FakeDataGenerator):
    """
    Generate 150 random students.
    Warning: User generation is slow because of the password hashing.
    """

    def make_students(self):
        print("Warning: this can take a few minutes")  # noqa: WPS421
        StudentFactory.create_batch(100)

    @FakeDataGenerator.locale("en_US")
    def make_students_en(self):
        StudentFactory.create_batch(50)
