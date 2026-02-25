import logging
from collections import OrderedDict

from django.db.models.signals import post_save

import factory
from factory.django import DjangoModelFactory

from apps.utils.factories.fake_data_generator import FakeDataGenerator

from .models import FACULTIES, PATHS, User
from .utils import clean_username

logger = logging.getLogger(__name__)

suffix = 0


def generate_unique_username(first_name, last_name):
    global suffix  # noqa: PLW0603
    suffix += 1
    return clean_username(f"{first_name.lower()}.{last_name.lower()}.{suffix}")


@factory.django.mute_signals(post_save)  # Use this because OneToOneField
class UserFactory(DjangoModelFactory):
    class Meta:
        model = User
        skip_postgeneration_save = True

    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    password = factory.django.Password("pass")
    username = factory.LazyAttribute(
        lambda obj: generate_unique_username(obj.first_name, obj.last_name)
    )
    email = factory.LazyAttribute(
        lambda obj: f"{obj.username}@fake.ec-nantes.fr"
    )

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

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        """Override the default ``_create`` with our custom call."""
        manager = cls._get_manager(model_class)
        # The default would use ``manager.create(*args, **kwargs)``
        return manager.create_user(*args, **kwargs)


class UserFakeData(FakeDataGenerator):
    """Generate 150 random users.
    Warning: User generation is slow because of the password hashing.
    """

    def make_users(self):
        logger.info("Warning: this can take a few minutes")
        UserFactory.create_batch(100)

    @FakeDataGenerator.locale("en_US")
    def make_users_en(self):
        UserFactory.create_batch(50)
