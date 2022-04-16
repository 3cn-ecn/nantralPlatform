from datetime import date
from django.test import TransactionTestCase
from apps.utils.utest import TestMixin
from django.urls import reverse
from rest_framework import status
from django.utils import timezone

from .models import Subscription, Notification, SentNotification
from apps.club.models import Club


class TestSubscription(TransactionTestCase, TestMixin):
    """Classe de test des abonnements à une page pour les notifications"""

    def setUp(self):
        self.user_setup()
        self.slug = Club.objects.create(name="Club de test").full_slug
        self.url = reverse('notification_api:subscription', args=self.slug)
        
    def tearDown(self):
        self.user_teardown()
    
    def test_reading_api(self):
        "test to read subscription states in database"
        # subscribe u2
        Subscription.objects.create(
            student=self.u2.student, page=self.slug)
        # check u2 has subscribed
        self.client.login(username=self.u2.username, password='pass')
        self.assertTrue(self.client.get(self.url).data)
        # check u3 didn't subscribed
        self.client.login(username=self.u3.username, password='pass')
        self.assertFalse(self.client.get(self.url).data)

    def test_adding_api(self):
        "test to subscribe"
        # subscribe
        self.client.login(username=self.u2.username, password='pass')
        resp = self.client.post(self.url)
        # check subscription is ok
        self.assertEqual(resp.status_code, 201)
        self.assertTrue(self.client.get(self.url).data)
        # try to subscribe again and check the fail
        resp = self.client.post(self.url)
        self.assertEqual(resp.status_code, 400)

    def test_delete_api(self):
        "test to unsubscribe"
        # subscribe
        Subscription.objects.create(
            student=self.u2.student, page=self.slug)
        # delete subscription
        self.client.login(username=self.u2.username, password='pass')
        resp = self.client.delete(self.url)
        # check deletion is ok
        self.assertEqual(resp.status_code, 204)
        self.assertFalse(self.client.get(self.url).data)
        # try to delete again and check the fail
        resp = self.client.delete(self.url)
        self.assertEqual(resp.status_code, 404)



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
            url = '/', 
            owner = self.club2,
        )
        Notification.objects.create(
            body="Notif de test 2", 
            url = '/', 
            owner = self.club1,
        )
        Notification.objects.create(
            body="Notif de test 3", 
            url = '/', 
            owner = self.club2,
        )
        # test subscribed notifs withoutlimit
        self.client.login(username=self.u2.username, password='pass')
        url = reverse('notification_api:my_notifications') + "?sub=True"
        resp = self.client.get(url)
        self.assertEqual(len(resp.data), 1)
        self.assertEqual(resp.data[0]['notification']['body'], "Notif de test 2")
        # test all notifs with limit of 2
        url = reverse('notification_api:my_notifications') + "?sub=False&nb=2"
        resp = self.client.get(url)
        self.assertEqual(len(resp.data), 2)
