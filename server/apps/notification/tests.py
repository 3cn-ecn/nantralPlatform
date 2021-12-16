from datetime import date
from django.test import TestCase
from apps.utils.utest import TestMixin
from django.urls import reverse
from rest_framework import status

from .models import Subscription, Notification, SentNotification


class TestNotification(TestCase, TestMixin):
    def setUp(self):
        self.user_setup()

    def test_subscription(self):
        Subscription.objects.create(
            student=self.u2, page='club--bde')
        self.assertTrue(Subscription.hasSubscribed('club--bde', self.u2))
        self.assertFalse(Subscription.hasSubscribed('club--bde', self.u1))
