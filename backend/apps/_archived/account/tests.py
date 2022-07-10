from datetime import datetime
from freezegun import freeze_time
from unittest import mock
import re

from django.contrib.auth import get_user
from django.contrib.auth.models import User
from django.core import mail
from django.test import TestCase, override_settings
from django.urls import reverse

from apps._archived.account.models import TemporaryAccessRequest
from apps.student.models import Student
from apps.utils.utest import TestMixin
from apps.utils.testing.mocks import discord_mock_message_post

PAYLOAD_TEMPLATE = {
    'first_name': 'test_name',
    'last_name': 'test_last_name',
    'email': 'test@ec-nantes.fr',
    'confirm_email': 'test@ec-nantes.fr',
    'promo': 2020,
    'faculty': 'Gen',
    'path': 'Cla'
}

REGEX_ACTIVATE_URL = (
    r"href='https://testserver/account/activate/([\w-]*)/([\w-]*)/'")
REGEX_ACTIVATE_TEMP_URL = (
    r"href='https://testserver/account/activate/([\w-]*)/([\w-]*)/temporary/'")
REGEX_RESET_PASS_URL = (
    r"href='https://testserver/account/reset_pass/([\w-]*)/([\w-]*)/'")


class TestAccount(TestCase, TestMixin):
    """Test class for account related methods."""

    def setUp(self):
        self.PAYLOAD = {
            **PAYLOAD_TEMPLATE,
            'password1': self.PASSWORD,
            'password2': self.PASSWORD,
        }

    def tearDown(self):
        self.user_teardown()

    @freeze_time("2021-09-01")
    @override_settings(TEMPORARY_ACCOUNTS_DATE_LIMIT=datetime(
        year=2021, month=9, day=2))
    def test_create_user_view_inside_temp(self):
        """Test that you can still create an account during temporary
        registration periods."""

        url = reverse('account:registration')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        url = reverse('account:registration')
        response = self.client.post(url, data=self.PAYLOAD)
        self.assertEqual(response.status_code, 302)

        self.assertEqual(len(User.objects.all()), 1)

        student = Student.objects.get(user__first_name='test_name')
        self.assertEqual(student.user, User.objects.all().last())
        assert len(mail.outbox) == 1
        extract = re.search(REGEX_ACTIVATE_URL, mail.outbox[0].body)
        uidb64 = extract.group(1)
        token = extract.group(2)

        # Check that the user cannot use the link to activate the account
        url = reverse('account:confirm', kwargs={
                      'uidb64': uidb64, 'token': token})
        response = self.client.get(url)

        user: User = User.objects.get(email='test@ec-nantes.fr')
        self.assertTrue(user.is_active)

    @freeze_time("2021-09-03")
    @override_settings(TEMPORARY_ACCOUNTS_DATE_LIMIT=datetime(
        year=2021, month=9, day=2))
    def test_create_user_view_outside_temp(self):
        """Test that you can still create an account outside temporary
        registration periods."""

        url = reverse('account:registration')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        url = reverse('account:registration')
        response = self.client.post(url, data=self.PAYLOAD)
        self.assertEqual(response.status_code, 302)

        self.assertEqual(len(User.objects.all()), 1)

        student = Student.objects.get(user__first_name='test_name')
        self.assertEqual(student.user, User.objects.all().last())
        assert len(mail.outbox) == 1
        extract = re.search(REGEX_ACTIVATE_URL, mail.outbox[0].body)
        uidb64 = extract.group(1)
        token = extract.group(2)

        # Check that the user cannot use the link to activate the account
        url = reverse('account:confirm', kwargs={
                      'uidb64': uidb64, 'token': token})
        response = self.client.get(url)

        user: User = User.objects.get(email='test@ec-nantes.fr')
        self.assertTrue(user.is_active)

    def test_login_view(self):
        url = reverse('account:login')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)


@freeze_time("2021-09-01")
@override_settings(TEMPORARY_ACCOUNTS_DATE_LIMIT=datetime(
    year=2021, month=9, day=2))
class TestTemporaryAccounts(TestCase, TestMixin):
    """Check that temporary accounts work within the correct time frame."""

    def setUp(self):
        self.PAYLOAD = {
            **PAYLOAD_TEMPLATE,
            'password1': self.PASSWORD,
            'password2': self.PASSWORD,
        }
        self.PAYLOAD_NOT_EC_NANTES = {
            **self.PAYLOAD,
            'email': 'test@not-ec-nantes.fr',
            'confirm_email': 'test@not-ec-nantes.fr',
        }

    @mock.patch('apps.utils.discord.requests.post')
    def test_temporary_registration_process(self, mock_post):

        # Define response for the fake API
        mock_post.return_value = discord_mock_message_post()

        url = reverse('account:temporary-registration')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        response = self.client.post(url, self.PAYLOAD_NOT_EC_NANTES)
        self.assertEqual(response.status_code, 302)
        user: User = User.objects.get(email='test@not-ec-nantes.fr')
        self.assertEqual(user.is_active, False)

        # Check that you cannot login yet
        url = reverse('account:login')
        payload = {
            'email': 'test@not-ec-nantes.fr',
            'password': self.PASSWORD
        }
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, 302)
        self.assertFalse(get_user(self.client).is_authenticated)
        # Check that a temporary access request has been created
        temp_req: TemporaryAccessRequest = TemporaryAccessRequest.objects.get(
            user=user.id)
        self.assertFalse(temp_req.approved)

        assert len(mail.outbox) == 1
        extract = re.search(REGEX_ACTIVATE_TEMP_URL, mail.outbox[0].body)
        uidb64 = extract.group(1)
        token = extract.group(2)

        # Check that the user cannot use the link to activate the account
        url = reverse('account:confirm', kwargs={
                      'uidb64': uidb64, 'token': token})
        response = self.client.get(url)

        self.assertContains(response, text='Ce lien n\'existe pas !')
        user: User = User.objects.get(email='test@not-ec-nantes.fr')
        self.assertFalse(user.is_active)

        # Confirm the temporary email
        url = reverse('account:confirm-temporary', kwargs={
                      'uidb64': uidb64, 'token': token})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)
        temp_req.refresh_from_db()
        self.assertFalse(temp_req.approved)

        # Check that you still cannot login
        url = reverse('account:login')
        payload = {
            'email': 'test@not-ec-nantes.fr',
            'password': self.PASSWORD
        }
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, 302)
        self.assertFalse(get_user(self.client).is_authenticated)

        # Check that not any anyone can approve the request
        url = reverse('account:temp-req-approve', kwargs={'id': temp_req.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)
        temp_req.refresh_from_db()
        self.assertFalse(temp_req.approved)

        # Check that a regular user cannot approve
        user = self.create_user('user1', 'test@test.fr')
        self.assertTrue(self.client.login(
            username=user.username, password=self.PASSWORD))
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)
        temp_req.refresh_from_db()
        self.assertFalse(temp_req.approved)

        # Check that an admin can approve the request
        user.is_superuser = True
        user.save()
        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)
        temp_req.refresh_from_db()
        self.assertTrue(temp_req.approved)
        self.client.logout()

        # Check that you can login
        url = reverse('account:login')
        payload = {
            'email': 'test@not-ec-nantes.fr',
            'password': self.PASSWORD
        }
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, 302)
        self.assertTrue(get_user(self.client).is_authenticated)
        url = reverse('home:home')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(
            response, 'Votre compte n\'est pas encore définitif.')
        self.assertEqual(len(mail.outbox), 2)

        # Check make account permanent
        url = reverse('account:upgrade-permanent')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)

        payload = {
            'email': 'test@ec-nantes.fr'
        }
        resp = self.client.post(url, payload)
        self.assertEqual(resp.status_code, 302)
        assert len(mail.outbox) == 3
        extract = re.search(REGEX_ACTIVATE_URL, mail.outbox[2].body)
        uidb64 = extract.group(1)
        token = extract.group(2)
        url = reverse(
            'account:confirm',
            kwargs={'uidb64': uidb64, 'token': token})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)
        user: User = User.objects.get(email='test@ec-nantes.fr')
        self.assertTrue(user.is_active)
        self.assertEqual(TemporaryAccessRequest.objects.all().count(), 0)
        url = reverse('account:upgrade-permanent')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 404)

    @mock.patch('apps.utils.discord.requests.post')
    def test_deny_temporary_req(self, mock_post):

        # Define response for the fake API
        mock_post.return_value = discord_mock_message_post()

        url = reverse('account:temporary-registration')
        response = self.client.post(url, self.PAYLOAD)
        self.assertEqual(response.status_code, 302)
        user: User = User.objects.get(email='test@ec-nantes.fr')
        self.assertEqual(user.is_active, False)

        temp_req: TemporaryAccessRequest = TemporaryAccessRequest.objects.get(
            user=user)
        resp = self.client.get(temp_req.deny_url)
        self.assertEqual(resp.status_code, 302)
        user = self.create_user('user1', 'test@test.fr')
        self.assertTrue(self.client.login(
            username=user.username, password=self.PASSWORD))
        response = self.client.get(temp_req.deny_url)
        self.assertEqual(response.status_code, 403)
        user.is_superuser = True
        user.save()
        self.client.get(temp_req.deny_url)
        self.assertEqual(len(mail.outbox), 2)
        self.assertEqual(TemporaryAccessRequest.objects.all().count(), 0)
        try:
            User.objects.get(email='test@ec-nantes.fr')
        except User.DoesNotExist:
            pass


@freeze_time("2021-09-03")
@override_settings(TEMPORARY_ACCOUNTS_DATE_LIMIT=datetime(
    year=2021, month=9, day=2))
class TestTemporaryAccountsNotAllowed(TestCase, TestMixin):
    """Check that temporary accounts don't work outside of the correct time
    frame."""

    def setUp(self):
        self.PAYLOAD_NOT_EC_NANTES = {
            **PAYLOAD_TEMPLATE,
            'email': 'test@not-ec-nantes.fr',
            'confirm_email': 'test@not-ec-nantes.fr',
            'password1': self.PASSWORD,
            'password2': self.PASSWORD,
        }

    def test_temp_registration_not_available(self):
        url = reverse('account:temporary-registration')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)

        response = self.client.post(url, self.PAYLOAD_NOT_EC_NANTES)
        self.assertEqual(response.status_code, 302)
        with self.assertRaises(User.DoesNotExist):
            User.objects.get(email='test@not-ec-nantes.fr')

    def test_temp_creation_not_available(self):
        user: User = User(
            first_name='test',
            last_name='test',
            email='test@ec-nantes.fr',
            is_active=False
        )
        user.save()
        TemporaryAccessRequest.objects.create(
            user=user
        )
        self.assertEqual(TemporaryAccessRequest.objects.all().count(), 0)

    @freeze_time("2021-09-01")
    @mock.patch('apps.utils.discord.requests.post')
    def test_temp_request_expired(self, mock_post):
        # Define response for the fake API
        mock_post.return_value = discord_mock_message_post()

        url = reverse('account:temporary-registration')

        response = self.client.post(url, self.PAYLOAD_NOT_EC_NANTES)
        self.assertEqual(response.status_code, 302)
        user: User = User.objects.get(email='test@not-ec-nantes.fr')
        assert len(mail.outbox) == 1
        extract = re.search(REGEX_ACTIVATE_TEMP_URL, mail.outbox[0].body)
        uidb64 = extract.group(1)
        token = extract.group(2)

        # Check that the user cannot use the link to activate the account
        url = reverse(
            'account:confirm-temporary',
            kwargs={'uidb64': uidb64, 'token': token})
        response = self.client.get(url)

        TemporaryAccessRequest.objects.get(user=user).approve()
        with freeze_time("2021-09-03"):
            # Check that you still cannot login
            url = reverse('account:login')
            payload = {
                'email': 'test@not-ec-nantes.fr',
                'password': self.PASSWORD
            }
            response = self.client.post(url, payload)
            self.assertEqual(response.status_code, 302)
            self.assertFalse(get_user(self.client).is_authenticated)


class TestForgottenPass(TestCase, TestMixin):

    NEW_PASSWORD = 'new'

    def setUp(self) -> None:
        self.create_user(username='test', email='test@ec-nantes.fr')

    def tearDown(self) -> None:
        self.user_teardown()

    def test_forgotten_pass_request(self):
        url = reverse('account:forgotten_pass')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        payload = {
            'email': 'not@ec-nantes.fr'
        }
        # Check that you cannot send email to unexisting email.
        response = self.client.post(url, data=payload)
        self.assertEqual(response.status_code, 302)
        assert len(mail.outbox) == 0

        payload = {
            'email': 'test@ec-nantes.fr'
        }
        response = self.client.post(url, data=payload)
        self.assertEqual(response.status_code, 302)
        assert len(mail.outbox) == 1
        extract = re.search(REGEX_RESET_PASS_URL, mail.outbox[0].body)
        uidb64 = extract.group(1)
        token = extract.group(2)
        url = reverse(
            'account:reset_pass',
            kwargs={'uidb64': uidb64, 'token': 'token'})

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Lien invalide')
        payload = {
            'new_password1': self.NEW_PASSWORD,
            'new_password2': self.NEW_PASSWORD,
        }
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, 200)

        # Check that you still cannot login
        url = reverse('account:login')
        payload = {
            'email': 'test@ec-nantes.fr',
            'password': self.NEW_PASSWORD,
        }
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, 302)
        self.assertFalse(get_user(self.client).is_authenticated)

        # Check with a valid token now

        url = reverse(
            'account:reset_pass',
            kwargs={'uidb64': uidb64, 'token': token})

        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)
        payload = {
            'new_password1': self.NEW_PASSWORD,
            'new_password2': self.NEW_PASSWORD,
        }
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, 302)
