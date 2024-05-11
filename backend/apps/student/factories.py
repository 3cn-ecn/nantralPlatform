from collections import OrderedDict

from django.db.models.signals import post_save

import factory
from factory.django import DjangoModelFactory

from apps.account.factories import UserFactory
from apps.utils.factories.fake_data_generator import FakeDataGenerator

from .models import FACULTIES, PATHS, Student


@factory.django.mute_signals(post_save)  # Use this because OneToOneField
class StudentFactory(DjangoModelFactory):
    class Meta:
        model = Student

    user = factory.SubFactory(UserFactory, student=None)
    promo = factory.Faker("year")
    faculty = factory.Faker(
        "random_element",
        elements=OrderedDict(
            (key, 10 if key == "Gen" else 1) for key, _ in FACULTIES
        ),
    )
    path = factory.Maybe(
        decider=factory.LazyAttribute(lambda obj: obj.faculty == "Gen"),
        yes_declaration=factory.Faker(
            "random_element",
            elements=OrderedDict(
                (key, 10 if key == "Cla" else 1) for key, _ in PATHS
            ),
        ),
        no_declaration="Cla",
    )


class StudentFakeData(FakeDataGenerator):
    """Generate 150 random students.
    Warning: User generation is slow because of the password hashing.
    """

    def make_students(self):
        print("Warning: this can take a few minutes")
        StudentFactory.create_batch(100)

    @FakeDataGenerator.locale("en_US")
    def make_students_en(self):
        StudentFactory.create_batch(50)
