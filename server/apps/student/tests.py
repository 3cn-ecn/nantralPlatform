from django.test import TestCase
from django.urls import reverse
from apps.utils.utest import TestMixin
from rest_framework import status

from .models import Student

class TestStudent(TestCase, TestMixin):
    def setUp(self):
        self.user_setup()

    def test_student_list(self):
        url = reverse('student:list')
        response = self.client.get(url)
        # Check that you have to be logged in
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        ok = self.client.login(username=self.u2.username, password='pass')
        self.assertTrue(ok)

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_student_profile(self):
        student = Student.objects.all().first()
        url = reverse('student:detail', args=[student.pk])
        response = self.client.get(url)
        # Check that you have to be logged in
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        ok = self.client.login(username=self.u2.username, password='pass')
        self.assertTrue(ok)

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_student_profile(self):
        student = Student.objects.all().first()
        url = reverse('student:update', args=[student.pk])
        response = self.client.get(url)
        # Check that you have to be logged in
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        ok = self.client.login(username=self.u2.username, password='pass')
        self.assertTrue(ok)

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # TO DO test that password change works
        # TO DO check that only admin and the right student has access to this page
    
    def tearDown(self):
        self.user_teardown()