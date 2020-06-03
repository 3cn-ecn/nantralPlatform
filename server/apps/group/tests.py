from django.test import TestCase
from apps.utils.utest import TestMixin
from django.urls import reverse
from rest_framework import status

from .models import Club

class TestGroups(TestCase, TestMixin):
    def setUp(self):
        self.user_setup()

    def test_create_club(self):
        Club.objects.create(name='TestClub')
        self.assertEqual(len(Club.objects.all()),1)
    
    def test_club_views(self):
        Club.objects.create(name='TestClub')
        club = Club.objects.all().first()
        print(club)
        url = reverse('group:detail', args=[club.pk])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        url = reverse('group:update', args=[club.pk])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_add_member(self):
        pass

