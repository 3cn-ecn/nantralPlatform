from django.db.models.signals import post_save

import factory
from factory.django import DjangoModelFactory

from .models import User


@factory.django.mute_signals(post_save)  # Use this because OneToOneField
class UserFactory(DjangoModelFactory):
    class Meta:
        model = User
        skip_postgeneration_save = True

    email = factory.Faker("email", domain="fake.ec-nantes.fr")
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    is_email_valid = True
    password = factory.django.Password("pass")
    username = factory.LazyAttribute(
        lambda obj: f"{obj.first_name.lower()}.{obj.last_name.lower()}",
    )

    # Declare the related student factory because of the OneToOneField
    # see: https://factoryboy.readthedocs.io/en/stable/recipes.html#example-django-s-profile
    student = factory.RelatedFactory(
        "apps.student.factories.StudentFactory",
        factory_related_name="user",
    )
