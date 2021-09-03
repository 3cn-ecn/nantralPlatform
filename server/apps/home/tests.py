from django.test import TestCase
from django.utils.timezone import make_aware
from django.urls import reverse
from rest_framework import status
from datetime import datetime, timedelta

from apps.event.models import BaseEvent
from apps.post.models import VISIBILITY
from apps.club.models import Club
from apps.utils.utest import TestMixin

'''
class TestHomeView(TestCase, TestMixin):
    def setUp(self):
        self.user_setup()
        self.test_club = Club.objects.create(name='TestClub')
        self.assertEqual(len(Club.objects.all()), 1)

    def test_home_view_events(self):
        """Test wether the home view displays events
        correctly."""
        self.past = BaseEvent.objects.create(
            date=make_aware(datetime.now() - timedelta(days=1)),
            title='An Event in the past',
            description="",
            location="Test",
            group=self.test_club.full_slug,
            publicity=VISIBILITY[0][0],
        )
        self.today = BaseEvent.objects.create(
            date=make_aware(datetime.now()),
            title='An Event today',
            description="",
            location="Test",
            group=self.test_club.full_slug,
            publicity=VISIBILITY[0][0]
        )
        self.tomorrow = BaseEvent.objects.create(
            date=make_aware(datetime.now() + timedelta(days=1)),
            title='An Event tomorrow',
            description="",
            location="Test",
            group=self.test_club.full_slug,
            publicity=VISIBILITY[0][0]
        )
        self.future = BaseEvent.objects.create(
            date=make_aware(datetime.now() + timedelta(days=10)),
            title='An Event in the distant future',
            description="",
            location="Test",
            group=self.test_club.full_slug,
            publicity=VISIBILITY[0][0]
        )
        self.assertEqual(len(BaseEvent.objects.all()), 4)

        self.client.login(username=self.u1.username, password="pass")
        # Test if / loads
        url = reverse("home:home")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Test if /api/event/ loads
        url = reverse("event_api:list-home-events")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        #self.assertEqual(len(resp.context["events"]), 3)
        # self.assertEqual(
        #    resp.context["events"]["Aujourd'hui"][0][0].title, "An Event today")
        # self.assertEqual(
        #    resp.context["events"]["Demain"][0][0].title, "An Event tomorrow")

    def tearDown(self):
        self.past.delete()
        self.today.delete()
        self.tomorrow.delete()
        self.future.delete()
'''