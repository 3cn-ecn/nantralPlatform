from rest_framework import status

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from apps.group.models import GroupType, Group
from apps.event.models import Event
from apps.post.models import VISIBILITY
from apps.utils.utest import TestMixin


class TestHomeView(TestCase, TestMixin):

    def setUp(self):
        self.user_setup()
        t = GroupType.objects.create(name="T1", slug="t1")
        self.test_club = Group.objects.create(name='TestClub', group_type=t)

    def test_home_view_events(self):
        """Test wether the home view displays events
        correctly."""
        self.past = Event.objects.create(
            start_date=timezone.now() - timezone.timedelta(days=1),
            title='An Event in the past',
            description="",
            location="Test",
            group=self.test_club,
            publicity=VISIBILITY[0][0],
        )
        self.today = Event.objects.create(
            start_date=timezone.now(),
            title='An Event today',
            description="",
            location="Test",
            group=self.test_club,
            publicity=VISIBILITY[0][0]
        )
        self.tomorrow = Event.objects.create(
            start_date=timezone.now() + timezone.timedelta(days=1),
            title='An Event tomorrow',
            description="",
            location="Test",
            group=self.test_club,
            publicity=VISIBILITY[0][0]
        )
        self.future = Event.objects.create(
            start_date=timezone.now() + timezone.timedelta(days=10),
            title='An Event in the distant future',
            description="",
            location="Test",
            group=self.test_club,
            publicity=VISIBILITY[0][0]
        )
        self.assertEqual(len(Event.objects.all()), 4)

        self.client.login(username=self.u1.username, password=self.PASSWORD)
        # Test if / loads
        url = reverse("home:home")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Test if /api/event/ loads
        url = "/api/event/"
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # self.assertEqual(len(resp.context["events"]), 3)
        # self.assertEqual(
        #    resp.context["events"]["Aujourd'hui"][0][0].title, "An Event today"
        # )
        # self.assertEqual(
        #    resp.context["events"]["Demain"][0][0].title, "An Event tomorrow"
        # )

    def tearDown(self):
        GroupType.objects.filter(slug='t1').delete()
        self.past.delete()
        self.today.delete()
        self.tomorrow.delete()
        self.future.delete()
        self.user_teardown()
