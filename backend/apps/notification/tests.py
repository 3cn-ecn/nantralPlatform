from django.test import TransactionTestCase
from django.urls import reverse

from rest_framework import status

from apps.group.models import Group, GroupType
from apps.utils.utest import TestMixin

from .models import Notification


class TestSubscription(TransactionTestCase, TestMixin):
    """Classe de test des abonnements à une page pour les notifications"""

    def setUp(self):
        self.user_setup()
        t = GroupType.objects.create(name="T1", slug="t1")
        self.g = Group.objects.create(name="Club de test", group_type=t)
        self.slug = self.g.slug
        self.url = reverse(
            "notification_api:subscription",
            kwargs={"slug": self.slug},
        )

    def tearDown(self):
        self.user_teardown()
        GroupType.objects.filter(slug="t1").delete()

    def test_reading_api(self):
        "test to read subscription states in database"
        # subscribe u2
        Group.objects.get(slug=self.slug).subscribers.add(self.u2)
        # check u2 has subscribed
        self.client.login(username=self.u2.email.email, password=self.password)
        self.assertTrue(self.client.get(self.url).data)
        # check u3 didn't subscribed
        self.client.login(username=self.u3.email.email, password=self.password)
        self.assertFalse(self.client.get(self.url).data)

    def test_adding_api(self):
        "test to subscribe"
        # subscribe
        self.client.login(username=self.u2.email.email, password=self.password)
        resp = self.client.post(self.url)
        # check subscription is ok
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(self.client.get(self.url).data)
        self.assertEqual(
            self.g.subscribers.filter(id=self.u2.id).count(),
            1,
        )
        # try to subscribe again and check we keep the same
        resp = self.client.post(self.url)
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            self.g.subscribers.filter(id=self.u2.id).count(),
            1,
        )

    def test_delete_api(self):
        "test to unsubscribe"
        # subscribe
        Group.objects.get(slug=self.slug).subscribers.add(self.u2)
        # delete subscription
        self.client.login(username=self.u2.email.email, password=self.password)
        resp = self.client.delete(self.url)
        # check deletion is ok
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(self.client.get(self.url).data)
        self.assertEqual(
            self.g.subscribers.filter(id=self.u2.id).count(),
            0,
        )
        # try to delete again and check we keep the same
        resp = self.client.delete(self.url)
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(
            self.g.subscribers.filter(id=self.u2.id).count(),
            0,
        )


class TestNotification(TransactionTestCase, TestMixin):
    """Classe de tests pour l'API de lecture des notifications"""

    def setUp(self):
        self.user_setup()
        t = GroupType.objects.create(name="T1", slug="t1")
        self.club1 = Group.objects.create(name="Club génial", group_type=t).slug
        self.club2 = Group.objects.create(
            name="Club inconnu",
            group_type=t,
        ).slug

    def tearDown(self):
        self.user_teardown()
        GroupType.objects.filter(slug="t1").delete()

    def test_notification_api(self):
        # create subscriptions and notifications
        Group.objects.get(slug=self.club1).subscribers.add(self.u2)
        Notification.objects.create(
            body="Notif de test 1",
            url="/",
            sender=self.club2,
        )
        Notification.objects.create(
            body="Notif de test 2",
            url="/",
            sender=self.club1,
        )
        Notification.objects.create(
            body="Notif de test 3",
            url="/",
            sender=self.club2,
        )
        # test subscribed notifs withoutlimit
        self.client.login(username=self.u2.email.email, password=self.password)
        url = "/api/notification/notification/?subscribed=true"
        resp = self.client.get(url)
        self.assertEqual(len(resp.data["results"]), 1)
        self.assertEqual(
            resp.data["results"][0]["notification"]["body"],
            "Notif de test 2",
        )
        # test all notifs with limit of 2
        url = "/api/notification/notification/?page_size=2"
        resp = self.client.get(url)
        self.assertEqual(len(resp.data["results"]), 2)
