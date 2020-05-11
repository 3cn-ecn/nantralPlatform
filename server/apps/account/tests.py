from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from apps.student.models import Student
from rest_framework import status

from apps.utils.utest import TestMixin
from apps.student.models import Student


# Create your tests here.

class Test_Account(TestCase, TestMixin):
    def setUp(self):
        pass
    def tearDown(self):
        # Delete everything you created
        self.user_teardown()
        User.objects.all().delete()
    
    def test_create_user_view(self):
        url = reverse('account:registration')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = {
            'first_name': 'test_name',
            'last_name': 'test_last_name',
            'email': 'test@ec-nantes.fr',
            'password1': 'pass',
            'password2': 'pass',
            'promo': 2020,
            'faculty': 'Gen',
            'double_degree': 'Cla'
        }
        url = reverse('account:registration')
        response = self.client.post(url, data=payload)
        self.assertEqual(response.status_code, 302)

        self.assertEqual(len(User.objects.all()), 1)

        student = Student.objects.get(first_name='test_name')
        self.assertEqual(student.user, User.objects.all().last())

    def test_login_view(self):
        url = reverse('account:login')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
