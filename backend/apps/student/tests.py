from django.test import TestCase
from django.urls import reverse

from rest_framework import status

from apps.utils.utest import TestMixin

from .models import Student


class TestStudent(TestCase, TestMixin):
    """Test class for student app."""

    new_password = "new_secured_password"

    def setUp(self):
        self.user_setup()

    def test_student_profile_update(self):
        student = Student.objects.get(id=self.u1.id)
        url = reverse("student:update", args=[student.pk])
        response = self.client.get(url)
        # Check that you have to be logged in
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)

        ok = self.client.login(email=self.u3.email, password=self.password)
        self.assertTrue(ok)
        with self.assertLogs("django.request", level="WARNING"):
            response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.client.logout()
        ok = self.client.login(email=self.u1.email, password=self.password)
        self.assertTrue(ok)

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.logout()

    def test_password_change(self):
        password_change = {
            "old_password": "wrong",
            "new_password1": self.new_password,
            "new_password2": self.new_password,
        }
        student = Student.objects.all().first()
        url = reverse("student:change_pass", args=[student.pk])
        response = self.client.post(url, data=password_change)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.client.logout()

        ok = self.client.login(email=self.u2.email, password=self.password)
        self.assertTrue(ok)

        password_change = {
            "old_password": self.password,
            "new_password1": self.new_password,
            "new_password2": self.new_password,
        }
        url = reverse("student:change_pass", args=[student.pk])
        response = self.client.post(
            url,
            data=password_change,
            follow_redirects=True,
        )
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)

        ok = self.client.login(email=self.u2.email, password=self.new_password)
        self.assertTrue(ok)

    def tearDown(self):
        self.user_teardown()
