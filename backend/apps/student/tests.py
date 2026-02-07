from django.test import TestCase
from django.urls import reverse

from rest_framework import status

from apps.account.models import User
from apps.utils.utest import TestMixin


class TestStudent(TestCase, TestMixin):
    """Test class for student app."""

    new_password = "new_secured_password"  # noqa: S105

    def setUp(self):
        self.user_setup()

    def test_student_profile_update(self):
        url = reverse("student:update", args=[self.u1.pk])
        response = self.client.get(url)
        # Check that you have to be logged in
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)

        ok = self.client.login(
            username=self.u3.email.email, password=self.password
        )
        self.assertTrue(ok)
        with self.assertLogs("django.request", level="WARNING"):
            response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.client.logout()
        ok = self.client.login(
            username=self.u1.email.email, password=self.password
        )
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
        user = User.objects.all().first()
        url = reverse("student:change_pass", args=[user.pk])
        response = self.client.post(url, data=password_change)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.client.logout()

        ok = self.client.login(
            username=self.u2.email.email, password=self.password
        )
        self.assertTrue(ok)

        password_change = {
            "old_password": self.password,
            "new_password1": self.new_password,
            "new_password2": self.new_password,
        }
        url = reverse("student:change_pass", args=[user.pk])
        response = self.client.post(
            url,
            data=password_change,
            follow_redirects=True,
        )
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)

        ok = self.client.login(
            username=self.u2.email.email, password=self.new_password
        )
        self.assertTrue(ok)

    def tearDown(self):
        self.user_teardown()
