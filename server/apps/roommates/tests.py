from datetime import date
from django.test import TestCase
from apps.utils.utest import TestMixin
from django.urls import reverse
from rest_framework import status

from .models import Housing, Roommates, NamedMembershipRoommates


class TestHousing(TestCase, TestMixin):
    def setUp(self):
        self.user_setup()

    def test_create_housing(self):
        Housing.objects.create(
            address='Place royale, Nantes 44000')
        self.assertEqual(len(Housing.objects.all()), 1)

    def test_housing_views(self):
        self.client.login(username=self.u1.username, password="pass")
        Housing.objects.create(
            address='Place royale, Nantes 44000')
        house = Housing.objects.all().first()
        url = reverse('roommates:detail', args=[house.pk])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        url = reverse('roommates:update', args=[house.pk])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        url = reverse('roommates:create-new')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        url = reverse('roommates:housing-map')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_housing_api_views(self):
        self.client.login(username=self.u1.username, password="pass")
        url = reverse('roommates_api:housing')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        payload = {
            'address': '10 place du commerce, Nantes 44000',
            'details': ''
        }
        resp = self.client.post(url, data=payload)
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    def test_add_roommates(self):
        self.client.login(username=self.u1.username, password="pass")
        house = Housing.objects.create(
            address='Place royale, Nantes 44000')
        payload = {
            'name': 'test',
            'begin_date': str(date.today()),
            'add_me': ''
        }
        url = reverse('roommates_api:housing-roommates', args=[house.pk])
        resp = self.client.post(url, payload)
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

        roommates = Roommates.objects.all().first()
        payload = {
            'student': self.u2.student.id,
            'nickname': 'test'
        }
        url = reverse('roommates_api:roommates-members', args=[roommates.pk])
        resp = self.client.post(url, payload)
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
