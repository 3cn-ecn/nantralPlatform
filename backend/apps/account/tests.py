# spell-checker: words utest uidb

import re
import uuid
from datetime import datetime, timezone
from unittest import mock

from django.contrib.auth import get_user
from django.core import mail
from django.test import TestCase, override_settings
from django.urls import reverse

from freezegun import freeze_time
from rest_framework import status

from apps.account.models import IdRegistration
from apps.student.models import Student
from apps.utils.testing.mocks import discord_mock_message_post
from apps.utils.utest import TestMixin

from .models import User

PAYLOAD_TEMPLATE = {
    "first_name": "test_name",
    "last_name": "test_last_name",
    "email": "test@ec-nantes.fr",
    "confirm_email": "test@ec-nantes.fr",
    "promo": 2020,
    "faculty": "Gen",
    "path": "Cla",
}

REGEX_ACTIVATE_URL = r"http://testserver/account/activate/([\w-]*)/([\w-]*)/"
REGEX_RESET_PASS_URL = (
    r"http://testserver/account/reset_pass/([\w-]*)/([\w-]*)/"  # noqa: S105
)


class TestAccount(TestCase, TestMixin):
    """Test class for account related methods."""

    def setUp(self):
        self.PAYLOAD = {
            **PAYLOAD_TEMPLATE,
            "password1": self.PASSWORD,
            "password2": self.PASSWORD,
        }

    def tearDown(self):
        self.user_teardown()

    def test_create_user_view_inside_temp(self):
        """Test that you can still create an account during temporary
        registration periods."""
        url = reverse("account:registration")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        url = reverse("account:registration")
        response = self.client.post(url, data=self.PAYLOAD)
        self.assertEqual(response.status_code, 302)

        self.assertEqual(len(User.objects.all()), 1)

        student = Student.objects.get(user__first_name="test_name")
        self.assertEqual(student.user, User.objects.all().last())
        self.assertEqual(len(mail.outbox), 1)
        extract = re.search(REGEX_ACTIVATE_URL, mail.outbox[0].body)
        uidb64 = extract.group(1) if extract else None
        token = extract.group(2) if extract else None

        # Check that the user cannot use the link to activate the account
        url = reverse(
            "account:confirm", kwargs={"uidb64": uidb64, "token": token}
        )
        response = self.client.get(url)

        user: User = User.objects.get(email="test@ec-nantes.fr")
        self.assertTrue(user.is_active)

    def test_create_user_view_outside_temp(self):
        """Test that you can still create an account outside temporary
        registration periods."""

        url = reverse("account:registration")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        url = reverse("account:registration")
        response = self.client.post(url, data=self.PAYLOAD)
        self.assertEqual(response.status_code, 302)

        self.assertEqual(len(User.objects.all()), 1)

        student = Student.objects.get(user__first_name="test_name")
        self.assertEqual(student.user, User.objects.all().last())
        self.assertEqual(len(mail.outbox), 1)
        extract = re.search(REGEX_ACTIVATE_URL, mail.outbox[0].body)
        uidb64 = extract.group(1) if extract else None
        token = extract.group(2) if extract else None

        # Check that the user cannot use the link to activate the account
        url = reverse(
            "account:confirm", kwargs={"uidb64": uidb64, "token": token}
        )
        response = self.client.get(url)

        user: User = User.objects.get(email="test@ec-nantes.fr")
        self.assertTrue(user.is_active)

    def test_login_view(self):
        url = reverse("account:login")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)


@freeze_time("2021-09-01")
class TestTemporaryAccounts(TestCase, TestMixin):
    """Check that temporary accounts work within the correct time frame."""

    def setUp(self):
        self.invite_id = IdRegistration.objects.create(
            expires_at=datetime(year=2021, month=9, day=2, tzinfo=timezone.utc)
        ).id
        self.PAYLOAD = {
            **PAYLOAD_TEMPLATE,
            "password1": self.PASSWORD,
            "password2": self.PASSWORD,
        }
        self.PAYLOAD_NOT_EC_NANTES = {
            **self.PAYLOAD,
            "email": "test@not-ec-nantes.fr",
            "confirm_email": "test@not-ec-nantes.fr",
            "invite_id": self.invite_id,
        }

    @mock.patch("apps.utils.discord.requests.post")
    def test_temporary_registration_process(self, mock_post):
        # Define response for the fake API
        mock_post.return_value = discord_mock_message_post()

        url = reverse("account:temporary-registration", args=[self.invite_id])

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        response = self.client.post(url, self.PAYLOAD_NOT_EC_NANTES)
        self.assertEqual(response.status_code, 302)
        user: User = User.objects.get(email="test@not-ec-nantes.fr")
        self.assertFalse(user.is_email_valid)
        self.assertTrue(user.is_active)

        # Check that you cannot login yet
        url = reverse("account:login")
        payload = {"email": "test@not-ec-nantes.fr", "password": self.PASSWORD}
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, 302)
        self.assertFalse(get_user(self.client).is_authenticated)
        # Check that user has an invitation
        self.assertIsNotNone(user.invitation)
        # Check that is email valid is False
        self.assertFalse(user.is_email_valid)
        # Check email content
        self.assertEqual(len(mail.outbox), 1)
        extract = re.search(REGEX_ACTIVATE_URL, mail.outbox[0].body)
        uidb64 = extract.group(1) if extract else None
        token = extract.group(2) if extract else None

        # Confirm the temporary email
        url = reverse(
            "account:confirm", kwargs={"uidb64": uidb64, "token": token}
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)

        # Check that you can login
        url = reverse("account:login")
        payload = {"email": "test@not-ec-nantes.fr", "password": self.PASSWORD}
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, 302)
        self.assertTrue(get_user(self.client).is_authenticated)
        url = reverse("home:home")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)

        # Check make account permanent
        url = reverse("account:upgrade-permanent")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        payload = {"email": "test@ec-nantes.fr"}
        resp = self.client.post(url, payload)
        self.assertEqual(resp.status_code, status.HTTP_302_FOUND)
        self.assertEqual(len(mail.outbox), 2)
        extract = re.search(REGEX_ACTIVATE_URL, mail.outbox[1].body)
        uidb64 = extract.group(1) if extract else None
        token = extract.group(2) if extract else None
        url = reverse(
            "account:confirm", kwargs={"uidb64": uidb64, "token": token}
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)
        user: User = User.objects.get(email="test@ec-nantes.fr")
        self.assertTrue(user.is_active)
        self.assertTrue(user.is_email_valid)

        url = reverse("account:upgrade-permanent")
        resp = self.client.get(url)
        # Check that user is redirected to home view
        self.assertEqual(resp.status_code, status.HTTP_302_FOUND)
        self.assertEqual(resp.url, "/")


@freeze_time("2021-09-03")
class TestTemporaryAccountsNotAllowed(TestCase, TestMixin):
    """Check that temporary accounts don't work outside of the correct time
    frame."""

    def setUp(self):
        self.PAYLOAD_NOT_EC_NANTES = {
            **PAYLOAD_TEMPLATE,
            "email": "test@not-ec-nantes.fr",
            "confirm_email": "test@not-ec-nantes.fr",
            "password1": self.PASSWORD,
            "password2": self.PASSWORD,
        }
        self.invite_id = IdRegistration.objects.create(
            expires_at=datetime(year=2021, month=9, day=2, tzinfo=timezone.utc)
        ).id

    def test_temp_registration_not_available(self):
        url = reverse("account:temporary-registration", args=[uuid.uuid4()])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)

        response = self.client.post(url, self.PAYLOAD_NOT_EC_NANTES)

        self.assertEqual(response.status_code, 302)
        with self.assertRaises(User.DoesNotExist):
            User.objects.get(email="test@not-ec-nantes.fr")

    @freeze_time("2021-09-01")
    @mock.patch("apps.utils.discord.requests.post")
    def test_temp_request_expired(self, mock_post):
        # Define response for the fake API
        mock_post.return_value = discord_mock_message_post()

        url = reverse("account:temporary-registration", args=[self.invite_id])

        response = self.client.post(url, self.PAYLOAD_NOT_EC_NANTES)
        self.assertEqual(response.status_code, 200)
        self.assertFalse(
            User.objects.filter(email="test@not-ec-nantes.fr").exists()
        )

        with freeze_time("2021-09-03"):
            # Check that you still cannot login
            url = reverse("account:login")
            payload = {
                "email": "test@not-ec-nantes.fr",
                "password": self.PASSWORD,
            }
            response = self.client.post(url, payload)
            self.assertEqual(response.status_code, 302)
            self.assertFalse(get_user(self.client).is_authenticated)


class TestForgottenPass(TestCase, TestMixin):
    new_password = "new"  # noqa: S105

    def setUp(self) -> None:
        self.create_user(username="test", email="test@ec-nantes.fr")

    def tearDown(self) -> None:
        self.user_teardown()

    def test_forgotten_pass_request(self):
        url = reverse("account:forgotten_pass")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        payload = {"email": "not@ec-nantes.fr"}
        # Check that you cannot send email to un-existing email.
        response = self.client.post(url, data=payload)
        self.assertEqual(response.status_code, 302)
        self.assertEqual(len(mail.outbox), 0)

        payload = {"email": "test@ec-nantes.fr"}
        response = self.client.post(url, data=payload)
        self.assertEqual(response.status_code, 302)
        self.assertEqual(len(mail.outbox), 1)

        extract = re.search(REGEX_RESET_PASS_URL, mail.outbox[0].body)
        uidb64 = extract.group(1) if extract else None
        token = extract.group(2) if extract else None
        url = reverse(
            "account:reset_pass", kwargs={"uidb64": uidb64, "token": "token"}
        )

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Lien invalide")
        payload = {
            "new_password1": self.new_password,
            "new_password2": self.new_password,
        }
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, 200)

        # Check that you still cannot login
        url = reverse("account:login")
        payload = {
            "email": "test@ec-nantes.fr",
            "password": self.new_password,
        }
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, 302)
        self.assertFalse(get_user(self.client).is_authenticated)

        # Check with a valid token now

        url = reverse(
            "account:reset_pass", kwargs={"uidb64": uidb64, "token": token}
        )

        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)
        payload = {
            "new_password1": self.new_password,
            "new_password2": self.new_password,
        }
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, 302)
