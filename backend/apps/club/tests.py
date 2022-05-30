from rest_framework import status
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from apps.utils.utest import TestMixin
from .models import Club, NamedMembershipClub


class TestGroups(TestCase, TestMixin):
    def setUp(self):
        self.user_setup()
    
    def tearDown(self):
        self.user_teardown()

    def test_create_club(self):
        Club.objects.create(name='TestClub')
        self.assertEqual(len(Club.objects.all()), 1)

    def test_club_views(self):
        Club.objects.create(name='TestClub')
        club = Club.objects.all().first()

        url = reverse('club:detail', args=[club.slug])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        url = reverse('club:update', args=[club.slug])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_302_FOUND)

    def test_add_member(self):
        club = Club.objects.create(name='TestClub')
        payload = {
            'function': 'test',
            'date_begin': timezone.now().today().date(),
        }
        url = reverse('club:add-member', args=[club.slug])
        resp = self.client.post(url, payload)
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

        self.client.login(username=self.u2.username, password=self.PASSWORD)
        resp = self.client.post(url, payload)
        self.assertEqual(resp.status_code, status.HTTP_302_FOUND)
        self.assertEqual(NamedMembershipClub.objects.filter(
            group=club, student=self.u2.student).count(), 1)
