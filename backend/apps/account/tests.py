# spell-checker: words utest uidb

import re
import uuid
from datetime import datetime, timezone
from unittest import mock

from django.contrib.auth import authenticate, get_user
from django.core import mail
from django.test import TestCase
from django.urls import reverse

from django_rest_passwordreset.models import ResetPasswordToken
from freezegun import freeze_time
from rest_framework import status

from apps.account.models import InvitationLink
from apps.utils.testing.mocks import discord_mock_message_post
from apps.utils.utest import TestMixin

from .api_views import (
    ACCOUNT_TEMPORARY,
    EMAIL_NOT_VALIDATED,
    FAILED,
    SUCCESS,
    TEMPORARY_ACCOUNT_EXPIRED,
)
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
    r"http://testserver/account/reset_pass/([\w-]*)/"  # noqa: S105
)


@freeze_time("2021-09-01")
class TestTemporaryAccounts(TestCase, TestMixin):
    """Check that temporary accounts work within the correct time frame."""

    def setUp(self):
        self.invite_id = InvitationLink.objects.create(
            expires_at=datetime(year=2021, month=9, day=2, tzinfo=timezone.utc)
        ).id
        self.PAYLOAD = {
            **PAYLOAD_TEMPLATE,
            "password1": self.password,
            "password2": self.password,
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
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        user: User = User.objects.get(email="test@not-ec-nantes.fr")
        self.assertFalse(user.is_email_valid)
        self.assertTrue(user.is_active)

        # Check that you cannot login yet
        url = reverse("account:login")
        payload = {"email": "test@not-ec-nantes.fr", "password": self.password}
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
        payload = {"email": "test@not-ec-nantes.fr", "password": self.password}
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
    frame.
    """

    def setUp(self):
        self.PAYLOAD_NOT_EC_NANTES = {
            **PAYLOAD_TEMPLATE,
            "email": "test@not-ec-nantes.fr",
            "confirm_email": "test@not-ec-nantes.fr",
            "password1": self.password,
            "password2": self.password,
        }
        self.invite_id = InvitationLink.objects.create(
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
                "password": self.password,
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
        token = extract.group(1) if extract else None
        url = reverse("account:reset_pass", kwargs={"token": "token"})

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

        url = reverse("account:reset_pass", kwargs={"token": token})

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        payload = {
            "new_password1": self.new_password,
            "new_password2": self.new_password,
        }
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, 200)


class TestLogin(TestCase):
    uri = reverse("account-api:account-login")

    def setUp(self) -> None:
        self.password = "test"
        self.user: User = User.objects.create_user(
            email="test@ec-nantes.fr",
            password=self.password,
            is_email_valid=True,
        )

    def test_login(self):
        response = self.client.post(
            self.uri,
            {"email": self.user.email, "password": self.password},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["code"], SUCCESS)

    def test_email_not_validated(self):
        self.user.is_email_valid = False
        self.user.save()
        response = self.client.post(
            self.uri,
            {"email": self.user.email, "password": self.password},
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.json()["code"], EMAIL_NOT_VALIDATED)

    def test_wrong_password(self):
        response = self.client.post(
            self.uri,
            {"email": self.user.email, "password": "wrongpassword"},
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.json().get("code"), FAILED)

    @freeze_time("2021-09-01")
    def test_login_temporary_account(self):
        # test for a valid invitation
        self.user.invitation = InvitationLink.objects.create(
            expires_at=datetime(year=2021, month=9, day=2, tzinfo=timezone.utc)
        )
        self.user.save()

        response = self.client.post(
            self.uri,
            {"email": self.user.email, "password": self.password},
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["code"], ACCOUNT_TEMPORARY)

        # test for an invalid invitation
        self.user.invitation = InvitationLink.objects.create(
            expires_at=datetime(year=2021, month=8, day=30, tzinfo=timezone.utc)
        )
        self.user.save()
        response = self.client.post(
            self.uri,
            {"email": self.user.email, "password": self.password},
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["code"], TEMPORARY_ACCOUNT_EXPIRED)


class TestRegister(TestCase):
    uri = reverse("account_api:account-register")

    def setUp(self) -> None:
        self.payload = {
            "first_name": "test",
            "last_name": "test",
            "email": "test@ec-nantes.fr",
            "password": "strong_password1",
            "promo": 2020,
            "faculty": "Gen",
        }

    def test_register(self):
        response = self.client.post(self.uri, self.payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Do not send back password
        self.assertIsNone(response.json().get("password"))

        user: User = authenticate(
            username=self.payload["email"], password=self.payload["password"]
        )
        self.assertIsNotNone(user)
        # check user informations
        self.assertFalse(user.is_email_valid)
        self.assertEqual(user.student.promo, self.payload["promo"])
        self.assertEqual(user.student.faculty, self.payload["faculty"])

        self.assertEqual(len(mail.outbox), 1)

    def test_weak_password(self):
        self.payload["password"] = "weak"

        response = self.client.post(self.uri, self.payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIsNotNone(response.json()["password"])

    def test_invalid_email(self):
        # email already taken
        User.objects.create(
            email=self.payload["email"],
            password=self.payload["password"],
            username="test",
        )
        response = self.client.post(self.uri, self.payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIsNotNone(response.json()["email"])

        # email not finishing with ec-nantes.fr
        self.payload["email"] = "test@wrongdomain.fr"

        response = self.client.post(self.uri, self.payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIsNotNone(response.json()["email"])

    @freeze_time("2021-09-01")
    def test_register_invitation(self):
        invitation = InvitationLink.objects.create(
            expires_at=datetime(year=2021, month=9, day=2, tzinfo=timezone.utc)
        )
        self.payload["email"] = "test@notecn.fr"
        self.payload["invitation_uuid"] = invitation.id

        response = self.client.post(self.uri, self.payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # can authenticate
        user: User = authenticate(
            username=self.payload["email"], password=self.payload["password"]
        )
        # Do not send back uuid
        self.assertIsNone(response.json().get("invitation_uuid"))
        self.assertIsNotNone(user)
        self.assertEqual(user.invitation, invitation)
        self.assertFalse(user.is_email_valid)

        self.assertEqual(len(mail.outbox), 1)

    @freeze_time("2021-09-10")
    def test_register_invitation_expired(self):
        invitation = InvitationLink.objects.create(
            expires_at=datetime(year=2021, month=9, day=2, tzinfo=timezone.utc)
        )
        self.payload["email"] = "test@notecn.fr"
        self.payload["invitation_uuid"] = invitation.id

        response = self.client.post(self.uri, self.payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestLogout(TestCase):
    uri = reverse("account-api:account-logout")

    def test_logout(self):
        self.user = User.objects.create_user(
            email="test@ec-nantes.fr", password="adminadmin"
        )
        self.client.force_login(self.user)
        response = self.client.post(self.uri)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.wsgi_request.user.is_authenticated)


class TestIsAuthenticated(TestCase):
    uri = reverse("account-api:account-is-authenticated")

    def test_is_authenticated(self):
        self.user = User.objects.create_user(
            email="test@ec-nantes.fr", password="adminadmin"
        )
        self.client.force_login(self.user)
        response = self.client.get(self.uri)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_is_not_authenticated(self):
        response = self.client.get(self.uri)
        self.assertEqual(response.status_code, 403)


class TestChangePassword(TestCase):
    url = reverse("account-api:account-change-password")

    def setUp(self) -> None:
        self.user = User.objects.create_user(
            email="test@ec-nantes.fr", password="adminadmin"
        )

    def test_change_password(self):
        self.client.force_login(self.user)
        payload = {"old_password": "adminadmin", "new_password": "testpassword"}
        response = self.client.post(self.url, payload)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # make sure user is still connected
        self.assertTrue(response.wsgi_request.user.is_authenticated)
        user = authenticate(
            username=self.user.email, password=payload["new_password"]
        )
        self.assertEqual(user, self.user)

    def test_weak_password(self):
        self.client.force_login(self.user)
        payload = {"old_password": "adminadmin", "new_password": "admin"}
        response = self.client.post(self.url, payload)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIsNotNone(response.json().get("new_password"))

    def test_wrong_password(self):
        self.client.force_login(self.user)
        payload = {
            "old_password": "wrongpassword",
            "new_password": "testpassword",
        }
        response = self.client.post(self.url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_is_authenticated(self):
        payload = {
            "old_password": "password",
            "new_password": "testpassword",
        }
        response = self.client.post(self.url, payload)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TestEdit(TestCase):
    url = reverse("account_api:account-edit")

    def setUp(self) -> None:
        self.user: User = User.objects.create_user(
            email="test@ec-nantes.fr", password="test", username="test"
        )

    def test_edit(self):
        self.client.force_login(self.user)
        payload = {
            "first_name": "Test",
            "last_name": "Test",
            "username": "Tesssst",
        }
        response = self.client.put(
            self.url, data=payload, content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, payload["first_name"].lower())
        self.assertEqual(self.user.last_name, payload["last_name"].lower())
        self.assertEqual(self.user.username, payload["username"])

    def test_taken_username(self):
        self.client.force_login(self.user)
        User.objects.create_user(
            email="test2@ec-nantes.fr", password="password", username="Tesssst"
        )
        payload = {
            "first_name": "Test",
            "last_name": "Test",
            "username": "Tesssst",
        }
        response = self.client.put(
            self.url, data=payload, content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_is_authenticated(self):
        payload = {
            "first_name": "Test",
            "last_name": "Test",
            "username": "Tesssst",
        }
        response = self.client.put(self.url, data=payload)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TestChangeEmail(TestCase):
    url = reverse("account_api:email-change")

    def setUp(self) -> None:
        self.user: User = User.objects.create_user(
            email="test@ec-nantes.fr", password="test", username="test"
        )

    def test_change_email(self):
        self.client.force_login(self.user)
        payload = {"password": "test", "email": "new@ec-nantes.fr"}
        response = self.client.put(
            self.url, data=payload, content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(mail.outbox), 1)
        self.user.refresh_from_db()
        self.assertEqual(self.user.email_next, payload["email"])

    def test_wrong_password(self):
        self.client.force_login(self.user)
        payload = {"password": "wrongpassword", "email": "new@ec-nantes.fr"}
        response = self.client.put(
            self.url, data=payload, content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_wrong_email(self):
        self.client.force_login(self.user)
        payload = {"password": "test", "email": "new@wrongdomain.fr"}
        response = self.client.put(
            self.url, data=payload, content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # with + in the email
        payload = {"password": "test", "email": "ne+w@ec-nantes.fr"}
        response = self.client.put(
            self.url, data=payload, content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_is_authenticated(self):
        payload = {"password": "test", "email": "new@ec-nantes.fr"}
        response = self.client.put(
            self.url, data=payload, content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TestForgottenPassword(TestCase):
    """Test forgotten password protocol. This part of the api is handled by
    django-restpasswordreset, so no need to test the library
    """

    def setUp(self):
        self.user = User.objects.create_user(
            email="test@ec-nantes.fr", password="test"
        )

    def test_forgot_password(self):
        url = reverse("account_api:password_reset:reset-password-request")

        response = self.client.post(url, {"email": "test@ec-nantes.fr"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)
        token = ResetPasswordToken.objects.get(user=self.user).key
        self.assertTrue(token in mail.outbox[0].body)


class TestEmailResend(TestCase):
    url = reverse("account_api:email-resend")

    def setUp(self) -> None:
        self.email = "test@ec-nantes.fr"
        self.user = User.objects.create(email=self.email)

    def test_email_resend(self):
        response = self.client.post(self.url, {"email": self.email})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)

    def test_email_resend_email_next(self):
        self.user.is_email_valid = True
        self.user.email_next = "new_email@ec-nantes.fr"
        self.user.save()
        response = self.client.post(self.url, {"email": self.email})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)

    def test_already_validated(self):
        self.user.is_email_valid = True
        self.user.save()
        response = self.client.post(self.url, {"email": self.email})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 0)

    def test_non_existant_email(self):
        response = self.client.post(self.url, {"email": "wrong@ec-nantes.fr"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
