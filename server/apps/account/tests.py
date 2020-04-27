from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from apps.student.models import Student
from rest_framework import status


# Create your tests here.

class Test_Account(TestCase):
    def setUp(self):
        pass
    def tearDown(self):
        # Delete everything you created
        Student.objects.all().delete()
        User.objects.all().delete()
    
    def test_create_user_view(self):
        url = reverse('account:registration')
        response = self.client.get(url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        payload = {
            'first_name': 'test_name',
            'last_name': 'test_last_name',
            'email': 'test@ec-nantes.fr',
            'password1': 'pass',
            'password2': 'pass',
            'promo': 2020
        }
        url = reverse('account:registration')
        response = self.client.post(url, data=payload)
        self.assertEquals(response.status_code, status.HTTP_302_FOUND)

        user = User.objects.get(first_name='test_name')
        self.assertIsNotNone(user)

    def test_login_view(self):
        url = reverse('account:login')
        response = self.client.get(url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        