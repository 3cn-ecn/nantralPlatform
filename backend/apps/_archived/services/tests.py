from django.test import TestCase
from django.urls import reverse

from rest_framework import status

from apps.utils.utest import TestMixin


class TestSignature(TestCase, TestMixin):
    def setUp(self):
        self.user_setup()

    def test_signature_gen(self):
        url = reverse("services:signature-gen")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def tearDown(self):
        self.user_teardown()
