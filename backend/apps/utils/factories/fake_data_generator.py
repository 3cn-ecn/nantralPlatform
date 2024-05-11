import sys

from django.core.management.base import OutputWrapper
from django.core.management.color import color_style
from django.db.utils import IntegrityError

import factory


def faker_locale(locale: str):
    """A decorator to change the locale of the Faker provider."""

    def decorator(func):
        def wrapper(*args, **kwargs):
            with factory.Faker.override_default_locale(locale):
                return func(*args, **kwargs)

        return wrapper

    return decorator


class FakeDataGenerator:
    """An abstract class that runs all methods beginning with 'make_'.
    Used to generate fake data with the 'manage.py fakedata' command.
    """

    dependencies = []

    stdout = OutputWrapper(sys.stdout)
    style = color_style()

    @faker_locale("fr_FR")
    def run(self):
        for name in dir(self):
            if name.startswith("make_"):
                try:
                    getattr(self, name)()
                except IntegrityError as e:
                    self.stdout.write(
                        f"{name} failed after creating a duplicate ({e})",
                        self.style.WARNING,
                    )

    @classmethod
    def locale(cls, locale):
        """Use this decorator to change the locale of the Faker provider.
        The default locale is 'fr_FR'.
        """
        return faker_locale(locale)
