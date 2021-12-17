from datetime import date
from django.test import TestCase
from apps.utils.utest import TestMixin
from django.urls import reverse
from rest_framework import status

from .models import Subscription, Notification, SentNotification
from apps.club.models import Club


class TestNotification(TestCase, TestMixin):
    def setUp(self):
        self.user_setup()
        
    def tearDown(self):
        self.user_teardown()

    def test_subscription(self):
        """Teste l'inscription d'un utilisateur à un club"""
        club = Club.objects.create(name="Club de test")
        Subscription.objects.create(
            student=self.u2.student, page=club.full_slug)
        self.assertTrue(Subscription.hasSubscribed(club.full_slug, self.u2.student))
        self.assertFalse(Subscription.hasSubscribed(club.full_slug, self.u3.student))
