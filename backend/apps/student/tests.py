from django.test import TestCase
from django.urls import reverse

from rest_framework import status

from apps.utils.utest import TestMixin

from .models import Student


class TestStudent(TestCase, TestMixin):
    """Test class for student app."""

    NEW_PASSWORD = "new"

    def setUp(self):
        self.user_setup()

    # def test_student_list(self):
    #     url = reverse('student:list')
    #     response = self.client.get(url)
    #     # Check that you have to be logged in
    #     self.assertEqual(response.status_code, status.HTTP_302_FOUND)
    #     ok = self.client.login(
    #         username=self.u2.username, password=self.PASSWORD)
    #     self.assertTrue(ok)

    #     response = self.client.get(url)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_student_profile_update(self):
        student = Student.objects.get(id=self.u1.id)
        url = reverse("student:update", args=[student.pk])
        response = self.client.get(url)
        # Check that you have to be logged in
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)

        ok = self.client.login(
            username=self.u3.username, password=self.PASSWORD
        )
        self.assertTrue(ok)
        with self.assertLogs("django.request", level="WARNING"):
            response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.client.logout()
        ok = self.client.login(
            username=self.u1.username, password=self.PASSWORD
        )
        self.assertTrue(ok)

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.logout()

    def test_password_change(self):
        password_change = {
            "old_password": "wrong",
            "new_password1": self.NEW_PASSWORD,
            "new_password2": self.NEW_PASSWORD,
        }
        student = student = Student.objects.all().first()
        url = reverse("student:change_pass", args=[student.pk])
        response = self.client.post(url, data=password_change)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.client.logout()

        ok = self.client.login(
            username=self.u2.username, password=self.PASSWORD
        )
        self.assertTrue(ok)

        password_change = {
            "old_password": self.PASSWORD,
            "new_password1": self.NEW_PASSWORD,
            "new_password2": self.NEW_PASSWORD,
        }
        url = reverse("student:change_pass", args=[student.pk])
        response = self.client.post(
            url, data=password_change, follow_redirects=True
        )
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)

        ok = self.client.login(
            username=self.u2.username, password=self.NEW_PASSWORD
        )
        self.assertTrue(ok)

    def tearDown(self):
        self.user_teardown()
