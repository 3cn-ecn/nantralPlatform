from datetime import date
from django.test import TransactionTestCase 
from apps.utils.utest import TestMixin
from django.urls import reverse
from rest_framework import status
from django.utils import timezone

from .models import Subscription, Notification, SentNotification
from apps.club.models import Club


class TestNotification(TransactionTestCase, TestMixin):
    def setUp(self):
        self.user_setup()
        
    def tearDown(self):
        self.user_teardown()

    def test_subscription(self):
        """Teste l'inscription d'un utilisateur à un club"""
        club = Club.objects.create(name="Club de test")

        # teste une inscription de u2 dans la bdd directement
        Subscription.objects.create(
            student=self.u2.student, page=club.full_slug)
        self.assertTrue(Subscription.hasSubscribed(club.full_slug, self.u2.student))
        self.assertFalse(Subscription.hasSubscribed(club.full_slug, self.u3.student))
        
        # test de lecture
        url = reverse('notification_api:subscription') + "?slug=" + club.full_slug
        self.client.login(username=self.u2.username, password='pass')
        self.assertTrue(self.client.get(url).data)
        self.client.login(username=self.u3.username, password='pass')
        self.assertFalse(self.client.get(url).data)

        # inscrit u3
        resp = self.client.post(url)
        self.assertEqual(resp.status_code, 201)
        self.assertTrue(self.client.get(url).data)
        resp = self.client.post(url)
        self.assertEqual(resp.status_code, 400)

        # désinscrit u2
        self.client.login(username=self.u2.username, password='pass')
        resp = self.client.delete(url)
        self.assertEqual(resp.status_code, 204)
        self.assertFalse(self.client.get(url).data)
        resp = self.client.delete(url)
        self.assertEqual(resp.status_code, 404)

        # check directly in the database
        self.assertFalse(Subscription.hasSubscribed(club.full_slug, self.u2.student))
        self.assertTrue(Subscription.hasSubscribed(club.full_slug, self.u3.student))




        
