from django.utils.timezone import timedelta

import factory
from factory.django import DjangoModelFactory
from faker import Faker as RealFaker

from apps.utils.factories.fake_data_generator import FakeDataGenerator

from ..account.models import User
from .models import Group, GroupType, Membership


class GroupTypeFactory(DjangoModelFactory):
    class Meta:
        model = GroupType
        django_get_or_create = ("slug",)


class GroupFactory(DjangoModelFactory):
    class Meta:
        model = Group
        django_get_or_create = ("slug",)
        skip_postgeneration_save = True

    name = factory.Faker("company")
    slug = ""
    description = factory.Faker("paragraph", nb_sentences=10)
    group_type = factory.Iterator(GroupType.objects.all())
    parent = factory.LazyAttribute(
        lambda obj: RealFaker().random_element(obj.possible_parents),
    )

    class Params:
        possible_parents = [None]

    @factory.post_generation
    def members(self, create, extracted, **kwargs):
        if not create:
            return

        nb_members = RealFaker().random_int(min=0, max=20)
        MembershipFactory.create_batch(
            size=nb_members,
            group=self,
        )


class MembershipFactory(DjangoModelFactory):
    class Meta:
        model = Membership
        django_get_or_create = ("group", "user")

    group = factory.Iterator(Group.objects.all())
    user = factory.Iterator(User.objects.all())
    admin = factory.Faker("boolean", chance_of_getting_true=0.1)
    summary = factory.Faker("sentence", nb_words=10)
    description = factory.Faker("paragraph", nb_sentences=5)
    begin_date = factory.Faker(
        "date_between",
        start_date="-1y",
        end_date="today",
    )
    end_date = factory.LazyAttribute(
        lambda obj: RealFaker().date_between(
            start_date=obj.begin_date,
            end_date=obj.begin_date + timedelta(days=365 * 2),
        ),
    )


class GroupFakeData(FakeDataGenerator):
    dependencies = ["UserFakeData"]

    def make_clubs(self):
        clubs = GroupTypeFactory.create(
            slug="club",
            name="Club & Assos",
            sort_fields="-parent__priority,parent__short_name,-priority,short_name",
            category_expr="""f"Clubs {group.parent.short_name}" if group.parent else "Associations" """,
        )
        bde = GroupFactory.create(slug="bde", name="Bureau des Élèves")
        bda = GroupFactory.create(slug="bda", name="Bureau des Arts")
        bds = GroupFactory.create(slug="bds", name="Bureau des Sports")
        clubs.extra_parents.add(bde, bda, bds)

        GroupFactory.create_batch(
            size=100,
            group_type=clubs,
            possible_parents=[bde, bda, bds, None],
        )

    def make_other_groups(self):
        listes = GroupTypeFactory.create(
            slug="liste",
            name="Listes BDX",
            no_membership_dates=True,
            sort_fields="-creation_year,-label__priority,label__name,short_name",
            category_expr="""f"Campagnes {group.creation_year}-{group.creation_year + 1}" if group.creation_year else "Autres" """,
            sub_category_expr="""group.label""",
            can_create=True,
            can_have_parent=False,
        )
        academics = GroupTypeFactory.create(slug="academic", name="Formations")

        GroupFactory.create_batch(
            size=50,
            group_type=factory.Faker(
                "random_element",
                elements=[listes, academics],
            ),
        )
