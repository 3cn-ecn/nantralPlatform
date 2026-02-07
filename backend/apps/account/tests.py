# spell-checker: words utest uidb
# ruff: noqa: S105, S106

from datetime import UTC, datetime, timedelta

from django.contrib.auth import authenticate
from django.core import mail
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from django_rest_passwordreset.models import ResetPasswordToken
from freezegun import freeze_time
from rest_framework import status

from apps.account.models import InvitationLink
from apps.utils.testing.mocks import create_student_user

from .api_views import (
    ACCOUNT_TEMPORARY,
    EMAIL_NOT_VALIDATED,
    FAILED,
    SUCCESS,
    TEMPORARY_ACCOUNT_EXPIRED,
)
from .models import User


class TestLogin(TestCase):
    uri = reverse("account-api:account-login")

    def setUp(self) -> None:
        self.password = "test"
        self.user: User = User.objects.create_user(
            email="test@ec-nantes.fr",
            password=self.password,
        )
        self.user.email.is_valid = True
        self.user.email.save()

    def test_login(self):
        response = self.client.post(
            self.uri,
            {"email": self.user.email, "password": self.password},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["code"], SUCCESS)

    def test_login_uppercase(self):
        # test you can still login with uppercase in email
        response = self.client.post(
            self.uri,
            {"email": self.user.email.email.upper(), "password": self.password},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_email_not_validated(self):
        self.user.email.is_valid = False
        self.user.email.save()
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

    def test_not_email(self):
        response = self.client.post(
            self.uri,
            {"email": "not email", "password": self.password},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_temporary_account(self):
        # Use an email from another provider
        new_email = self.user.add_email("test@example.com")
        new_email.is_valid = True
        new_email.save()
        old_email = self.user.email
        self.user.email = new_email
        self.user.save()
        self.user.remove_email(old_email)

        # test for a valid invitation
        self.user.invitation = InvitationLink.objects.create(
            expires_at=timezone.now() + timedelta(days=1),
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
            expires_at=timezone.now() - timedelta(days=1),
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
            username=self.payload["email"],
            password=self.payload["password"],
        )
        self.assertIsNotNone(user)
        # check user informations
        self.assertFalse(user.is_email_valid())
        self.assertEqual(user.promo, self.payload["promo"])
        self.assertEqual(user.faculty, self.payload["faculty"])

        self.assertEqual(len(mail.outbox), 1)

    def test_weak_password(self):
        self.payload["password"] = "weak"

        response = self.client.post(self.uri, self.payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIsNotNone(response.json()["password"])

    def test_invalid_email(self):
        # email already taken
        User.objects.create_user(
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

    def test_register_invitation(self):
        invitation = InvitationLink.objects.create(
            expires_at=timezone.now() + timedelta(days=1),
        )
        self.payload["email"] = "test@notecn.fr"
        self.payload["invitation_uuid"] = invitation.id

        response = self.client.post(self.uri, self.payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # can authenticate
        user: User = authenticate(
            username=self.payload["email"],
            password=self.payload["password"],
        )
        # Do not send back uuid
        self.assertIsNone(response.json().get("invitation_uuid"))
        self.assertIsNotNone(user)
        self.assertEqual(user.invitation, invitation)
        self.assertFalse(user.is_email_valid())

        self.assertEqual(len(mail.outbox), 1)

    def test_register_invitation_expired(self):
        invitation = InvitationLink.objects.create(
            expires_at=timezone.now() - timedelta(days=1),
        )
        self.payload["email"] = "test@notecn.fr"
        self.payload["invitation_uuid"] = invitation.id

        response = self.client.post(self.uri, self.payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestLogout(TestCase):
    uri = reverse("account-api:account-logout")

    def test_logout(self):
        self.user = User.objects.create_user(
            email="test@ec-nantes.fr",
            password="adminadmin",
        )
        self.client.force_login(self.user)
        response = self.client.post(self.uri)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.wsgi_request.user.is_authenticated)


class TestIsAuthenticated(TestCase):
    uri = reverse("account-api:account-is-authenticated")

    def test_is_authenticated(self):
        self.user = User.objects.create_user(
            email="test@ec-nantes.fr",
            password="adminadmin",
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
            email="test@ec-nantes.fr",
            password="adminadmin",
        )

    def test_change_password(self):
        self.client.force_login(self.user)
        payload = {"old_password": "adminadmin", "new_password": "testpassword"}
        response = self.client.post(self.url, payload)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # make sure user is still connected
        self.assertTrue(response.wsgi_request.user.is_authenticated)
        user = authenticate(
            username=self.user.email.email,
            password=payload["new_password"],
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


class TestEditUsername(TestCase):
    url = reverse("account-api:account-edit-username")

    def setUp(self) -> None:
        self.user: User = User.objects.create_user(
            email="test@ec-nantes.fr",
            password="test",
            username="test",
        )

    def test_edit(self):
        self.client.force_login(self.user)
        payload = {
            "username": "tesssst",
        }
        response = self.client.put(
            self.url,
            data=payload,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, payload["username"])

    def test_taken_username(self):
        self.client.force_login(self.user)
        User.objects.create_user(
            email="test2@ec-nantes.fr",
            password="password",
            username="tesssst",
        )
        payload = {
            "username": "tesssst",
        }
        response = self.client.put(
            self.url,
            data=payload,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_is_authenticated(self):
        payload = {
            "username": "tesssst",
        }
        response = self.client.put(self.url, data=payload)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_invalid_username_underscore(self):
        self.client.force_login(self.user)
        payload = {
            "username": "_tesssst",
        }
        response = self.client.put(
            self.url, data=payload, content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_username_char(self):
        self.client.force_login(self.user)
        payload = {
            "username": "Tesssst",
        }
        response = self.client.put(
            self.url, data=payload, content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestChangeEmail(TestCase):
    url = reverse("account_api:email-change")

    def setUp(self) -> None:
        self.user: User = User.objects.create_user(
            email="test@ec-nantes.fr",
            password="test",
            username="test",
        )

    def test_change_email(self):
        self.client.force_login(self.user)
        payload = {"password": "test", "email": "new@ec-nantes.fr"}
        response = self.client.put(
            self.url,
            data=payload,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(mail.outbox), 1)
        self.user.refresh_from_db()
        self.assertEqual(self.user.email.email, payload["email"])
        self.assertTrue(self.user.has_email(payload["email"]))

    def test_wrong_password(self):
        self.client.force_login(self.user)
        payload = {"password": "wrongpassword", "email": "new@ec-nantes.fr"}
        response = self.client.put(
            self.url,
            data=payload,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_wrong_email(self):
        self.client.force_login(self.user)
        # with + in the email
        payload = {"password": "test", "email": "ne+w@ec-nantes.fr"}
        response = self.client.put(
            self.url,
            data=payload,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_is_authenticated(self):
        payload = {"password": "test", "email": "new@ec-nantes.fr"}
        response = self.client.put(
            self.url,
            data=payload,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TestForgottenPassword(TestCase):
    """Test forgotten password protocol. This part of the api is handled by
    django-restpasswordreset, so no need to test the library
    """

    def setUp(self):
        self.user = create_student_user(
            email="test@ec-nantes.fr",
            password="test",
        )

    def test_forgot_password(self):
        url = reverse("account_api:password_reset:reset-password-request")

        response = self.client.post(url, {"email": "test@ec-nantes.fr"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)
        token = ResetPasswordToken.objects.get(user=self.user).key
        self.assertTrue(token in mail.outbox.pop().body)


class TestValidateInvitation(TestCase):
    url = reverse("account_api:account-validate-invitation")

    def setUp(self):
        self.invite_id = InvitationLink.objects.create(
            expires_at=datetime(year=2021, month=9, day=3, tzinfo=UTC),
        ).id

    @freeze_time("2021-09-01")
    def test_validate_invitation(self):
        response = self.client.post(self.url, {"uuid": self.invite_id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @freeze_time("2021-09-10")
    def test_expired(self):
        response = self.client.post(self.url, {"uuid": self.invite_id})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_not_uuid(self):
        response = self.client.post(self.url, {"uuid": "not_uuid"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestEmailResend(TestCase):
    url = reverse("account_api:email-resend")

    def setUp(self) -> None:
        self.email = "test@ec-nantes.fr"
        self.user = User.objects.create()
        self.user.email = self.user.add_email(self.email)
        self.user.save()

    def test_email_resend(self):
        response = self.client.post(self.url, {"email": self.email})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)

    def test_already_validated(self):
        self.user.email.is_valid = True
        self.user.email.save()
        response = self.client.post(self.url, {"email": self.email})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 0)

    def test_wrong_email(self):
        response = self.client.post(self.url, {"email": "wrong@ec-nantes.fr"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.post(self.url, {"email": "not email"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
