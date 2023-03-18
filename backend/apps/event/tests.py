from django.test import TestCase
from django.utils import timezone
from django.urls import reverse
from rest_framework import status

from apps.group.models import Group, GroupType
from apps.utils.utest import TestMixin

from .models import Event


class EventTestCase(TestCase, TestMixin):

    def setUp(self) -> None:
        self.user_setup()
        t = GroupType.objects.create(name="T1", slug="t1")
        self.g = Group.objects.create(name="TestClubForEvents", group_type=t)
        self.g.members.add(
            self.u2.student,
            through_defaults={'admin': True}
        )
        self.event = Event.objects.create(
            title="A test event 1",
            group=self.g,
            date=timezone.now(),
            description="Test Desc",
            location="Amphi A")
        # self.assertEqual(len(Event.objects.all()), 1)

    def tearDown(self):
        self.user_teardown()
        GroupType.objects.filter(slug='t1').delete()
        Event.objects.all().delete()

    def test_event_detail_view(self):
        url = reverse('event:detail', args=[self.event.slug])
        # Une personne non connectée ne doit pas pouvoir voir l'event et doit
        # être redirigée vers la page de login
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_302_FOUND)

        self.client.login(username=self.u2, password=self.PASSWORD)
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_participate_function(self):
        """Check that a user can registrate for an event."""
        url = reverse('event:add-participant', args=[self.event.slug])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_302_FOUND)
        self.assertEqual(self.event.number_of_participants, 0)

        self.client.login(username=self.u2, password=self.PASSWORD)
        # You get redirected at the end of the function
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_302_FOUND)
        self.assertEqual(self.event.number_of_participants, 1)
        # Check that you only get counted once
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_302_FOUND)
        self.assertEqual(self.event.number_of_participants, 1)

        url = reverse('event:remove-participant', args=[self.event.slug])
        resp = self.client.get(url)
        # You get redirected at the end of the function
        self.assertEqual(resp.status_code, status.HTTP_302_FOUND)
        self.assertEqual(self.event.number_of_participants, 0)

    def test_event_update_view(self):
        url = reverse("event:edit", args=[self.event.pk])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_302_FOUND)

        self.client.login(username=self.u2, password=self.PASSWORD)
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
