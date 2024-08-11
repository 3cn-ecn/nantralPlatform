from django.db.models.signals import post_save

import factory
from factory.django import DjangoModelFactory

from .models import User

suffix = 0


def generate_unique_username(first_name, last_name):
    global suffix  # noqa: PLW0603
    suffix += 1
    return f"{first_name.lower()}.{last_name.lower()}{suffix}"


@factory.django.mute_signals(post_save)  # Use this because OneToOneField
class UserFactory(DjangoModelFactory):
    class Meta:
        model = User
        skip_postgeneration_save = True

    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    is_email_valid = True
    password = factory.django.Password("pass")
    username = factory.LazyAttribute(
        lambda obj: generate_unique_username(obj.first_name, obj.last_name)
    )
    email = factory.LazyAttribute(
        lambda obj: f"{obj.username}@fake.ec-nantes.fr"
    )

    # Declare the related student factory because of the OneToOneField
    # see: https://factoryboy.readthedocs.io/en/stable/recipes.html#example-django-s-profile
    student = factory.RelatedFactory(
        "apps.student.factories.StudentFactory",
        factory_related_name="user",
    )
