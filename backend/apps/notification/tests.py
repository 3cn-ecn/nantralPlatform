from rest_framework import status
from django.test import TransactionTestCase
from django.urls import reverse

from apps.club.models import Club
from apps.utils.utest import TestMixin

from .models import Subscription, Notification


class TestSubscription(TransactionTestCase, TestMixin):
    """Classe de test des abonnements à une page pour les notifications"""

    def setUp(self):
        self.user_setup()
        self.slug = Club.objects.create(name="Club de test").full_slug
        self.url = reverse(
            'notification_api:subscription', kwargs={'page': self.slug})

    def tearDown(self):
        self.user_teardown()

    def test_reading_api(self):
        "test to read subscription states in database"
        # subscribe u2
        Subscription.objects.create(
            student=self.u2.student, page=self.slug)
        # check u2 has subscribed
        self.client.login(username=self.u2.username, password=self.PASSWORD)
        self.assertTrue(self.client.get(self.url).data)
        # check u3 didn't subscribed
        self.client.login(username=self.u3.username, password=self.PASSWORD)
        self.assertFalse(self.client.get(self.url).data)

    def test_adding_api(self):
        "test to subscribe"
        # subscribe
        self.client.login(username=self.u2.username, password=self.PASSWORD)
        resp = self.client.post(self.url)
        # check subscription is ok
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(self.client.get(self.url).data)
        # try to subscribe again and check the fail
        with self.assertLogs('django.request', level='WARNING'):
            resp = self.client.post(self.url)
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_delete_api(self):
        "test to unsubscribe"
        # subscribe
        Subscription.objects.create(
            student=self.u2.student, page=self.slug)
        # delete subscription
        self.client.login(username=self.u2.username, password=self.PASSWORD)
        resp = self.client.delete(self.url)
        # check deletion is ok
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(self.client.get(self.url).data)
        # try to delete again and check the fail
        with self.assertLogs('django.request', level='WARNING'):
            resp = self.client.delete(self.url)
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)


class TestNotification(TransactionTestCase, TestMixin):
    """Classe de tests pour l'API de lecture des notifications"""

    def setUp(self):
        self.user_setup()
        self.club1 = Club.objects.create(name="Club génial").full_slug
        self.club2 = Club.objects.create(name="Club inconnu").full_slug

    def tearDown(self):
        self.user_teardown()

    def test_notification_api(self):
        # create subscriptions and notifications
        Subscription.objects.create(
            student=self.u2.student, page=self.club1)
        Notification.objects.create(
            body="Notif de test 1",
            url='/',
            sender=self.club2,
        )
        Notification.objects.create(
            body="Notif de test 2",
            url='/',
            sender=self.club1,
        )
        Notification.objects.create(
            body="Notif de test 3",
            url='/',
            sender=self.club2,
        )
        # test subscribed notifs withoutlimit
        self.client.login(username=self.u2.username, password=self.PASSWORD)
        url = reverse('notification_api:get_notifications') + "?mode=2&sub=True"
        resp = self.client.get(url)
        self.assertEqual(len(resp.data), 1)
        self.assertEqual(
            resp.data[0]['notification']['body'], "Notif de test 2")
        # test all notifs with limit of 2
        url = reverse('notification_api:get_notifications')
        url += "?mode=2&sub=False&start=0&nb=2"
        resp = self.client.get(url)
        self.assertEqual(len(resp.data), 2)
