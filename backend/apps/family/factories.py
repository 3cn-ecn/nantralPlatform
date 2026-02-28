import random
from datetime import datetime

import factory
from factory.django import DjangoModelFactory
from faker import Faker as RealFaker
from pytz import UTC

from apps.family.models import (
    MAX_2APLUS_PER_FAMILY,
    MIN_2APLUS_PER_FAMILY,
    AnswerFamily,
    AnswerMember,
    Family,
    MembershipFamily,
    QuestionFamily,
    QuestionMember,
)
from apps.utils.factories.fake_data_generator import FakeDataGenerator

from .utils import FIRST_MONTH_OF_NEW_CYCLE

fake = RealFaker()
FAMILY_NUMBER = 5


def get_current_academic_year():
    now = datetime.now(UTC)
    if now.month >= FIRST_MONTH_OF_NEW_CYCLE:  # June or later
        return now.year
    else:
        return now.year - 1


class FamilyFactory(DjangoModelFactory):
    class Meta:
        model = Family

    name = factory.LazyFunction(fake.unique.last_name)
    description = factory.Faker("sentence", nb_words=10)
    year = factory.LazyFunction(get_current_academic_year)
    non_subscribed_members = factory.Faker("name")


class MembershipFamilyFactory(DjangoModelFactory):
    class Meta:
        model = MembershipFamily

    user = factory.SubFactory("apps.account.factories.UserFactory")
    role = factory.Iterator(["1A", "2A+"])

    @factory.lazy_attribute
    def group(self):
        # Only assign a group if the role is "2A+"
        if self.role == "2A+":
            return self._get_family_with_available_spots()
        return None

    def _get_family_with_available_spots(self):
        families = Family.objects.all()
        for family in families:
            if (
                family.members.filter(membershipfamily__role="2A+").count()
                < MAX_2APLUS_PER_FAMILY
            ):
                return family
        return FamilyFactory.create()


class AnswerFamilyFactory(DjangoModelFactory):
    class Meta:
        model = AnswerFamily

    question = factory.Iterator(QuestionFamily.objects.all())
    family = factory.SubFactory(FamilyFactory)
    answer = factory.Faker("random_int", min=0, max=1)
    custom_coeff = factory.Faker("random_int", min=0, max=5)


class AnswerMemberFactory(DjangoModelFactory):
    class Meta:
        model = AnswerMember

    question = factory.Iterator(QuestionMember.objects.all())
    member = factory.SubFactory(MembershipFamilyFactory)
    answer = factory.Faker("random_int", min=0, max=1)
    custom_coeff = factory.Faker("random_int", min=0, max=5)


class FamilyFakeData(FakeDataGenerator):
    dependencies = ["GroupFakeData", "UserFakeData"]

    def make_families(self):
        for i in range(FAMILY_NUMBER):
            print(f"Création de la famille {i + 1}/{FAMILY_NUMBER}")  # noqa: T201

            family = FamilyFactory.create()
            num_2a_plus = random.randint(
                MIN_2APLUS_PER_FAMILY, MAX_2APLUS_PER_FAMILY - 1
            )
            num_1a = 10 - num_2a_plus

            members_2a_plus = MembershipFamilyFactory.create_batch(
                num_2a_plus, group=family, role="2A+"
            )
            members_1a = MembershipFamilyFactory.create_batch(num_1a, role="1A")

            all_members = members_2a_plus + members_1a

            # Ensure all questions are answered for each member
            for member in all_members:
                for question in QuestionMember.objects.all():
                    AnswerMemberFactory.create(member=member, question=question)

            # Ensure all questions are answered for the family
            for question in QuestionFamily.objects.all():
                AnswerFamilyFactory.create(family=family, question=question)


if __name__ == "__main__":
    FamilyFakeData().make_families()
