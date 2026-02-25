from django.test import TestCase
from django.utils import timezone

from apps.group.models import Group, GroupType
from apps.utils.utest import TestMixin

from .models import Event


class EventTestCase(TestCase, TestMixin):
    def setUp(self) -> None:
        self.user_setup()
        t = GroupType.objects.create(name="T1", slug="t1")
        self.g = Group.objects.create(name="TestClubForEvents", group_type=t)
        self.g.members.add(self.u2, through_defaults={"admin": True})
        self.event = Event.objects.create(
            title="A test event 1",
            group=self.g,
            start_date=timezone.now(),
            description="Test Desc",
            location="Amphi A",
        )

    def tearDown(self):
        self.user_teardown()
        GroupType.objects.filter(slug="t1").delete()
        Event.objects.all().delete()
