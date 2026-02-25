import random

from django.utils.timezone import get_current_timezone, timedelta

import factory
from factory.django import DjangoModelFactory
from faker import Faker as RealFaker

from apps.account.models import User
from apps.group.models import Group
from apps.utils.factories.fake_data_generator import FakeDataGenerator
from apps.utils.factories.random_maybe import random_maybe

from .models import Event


class EventFactory(DjangoModelFactory):
    class Meta:
        model = Event
        skip_postgeneration_save = True

    title = factory.Faker("sentence", nb_words=4)
    description = factory.Faker("text")
    start_date = factory.Faker(
        "date_time_this_year",
        after_now=True,
        tzinfo=get_current_timezone(),
    )
    end_date = factory.LazyAttribute(
        # We need to use RealFaker inside LazyAttribute only
        lambda obj: RealFaker().date_time_between(
            start_date=obj.start_date,
            end_date=obj.start_date + timedelta(days=1),
            tzinfo=get_current_timezone(),
        ),
    )
    location = factory.Faker("address")
    max_participant = random_maybe(
        factory.Faker("random_int", min=1, max=50),
        p=0.1,
    )
    form_url = random_maybe(factory.Faker("url"), "", p=0.1)
    start_registration = random_maybe(
        factory.LazyAttribute(
            lambda obj: RealFaker().date_time_between(
                start_date=obj.start_date - timedelta(days=30),
                end_date=obj.start_date - timedelta(days=15),
                tzinfo=get_current_timezone(),
            ),
        ),
        p=0.1,
    )
    end_registration = random_maybe(
        factory.LazyAttribute(
            lambda obj: RealFaker().date_time_between(
                start_date=obj.start_date - timedelta(days=15),
                end_date=obj.start_date - timedelta(days=1),
                tzinfo=get_current_timezone(),
            ),
        ),
        p=0.1,
    )
    group = factory.Iterator(Group.objects.all())
    publicity = "Pub"

    @factory.post_generation
    def participants(self, create, extracted, **kwargs):
        if not create:
            return
        nb_participants = random.randint(0, 15)
        queryset = User.objects.order_by("?")[:nb_participants]
        self.participants.add(*queryset)

    @factory.post_generation
    def bookmarks(self, create, extracted, **kwargs):
        if not create:
            return
        nb_bookmarks = random.randint(0, 15)
        queryset = User.objects.order_by("?")[:nb_bookmarks]
        self.bookmarks.add(*queryset)


class EventFakeData(FakeDataGenerator):
    dependencies = ["GroupFakeData"]

    def make_events(self):
        EventFactory.create_batch(50)
