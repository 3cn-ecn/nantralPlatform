from django.conf import settings
from django.contrib.auth import get_user
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from apps.account.models import TemporaryAccessRequest
from apps.student.models import Student
from django.core import mail
import re
from unittest import mock
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
        self.assertEqual(response.status_code, 200)
        payload = {
            'first_name': 'test_name',
            'last_name': 'test_last_name',
            'email': 'test@ec-nantes.fr',
            'confirm_email': 'test@ec-nantes.fr',
            'password1': 'pass',
            'password2': 'pass',
            'promo': 2020,
            'faculty': 'Gen',
            'path': 'Cla'
        }
        url = reverse('account:registration')
        response = self.client.post(url, data=payload)
        self.assertEqual(response.status_code, 302)

        self.assertEqual(len(User.objects.all()), 1)

        student = Student.objects.get(user__first_name='test_name')
        self.assertEqual(student.user, User.objects.all().last())

    def test_login_view(self):
        url = reverse('account:login')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)


class TestTemporaryAccounts(TestCase, TestMixin):
    def setUp(self):
        pass

    @mock.patch('apps.utils.discord.requests.post')
    def test_temporary_registration_process(self, mock_post):
        # Mock response from the discord API
        mock_response = mock.Mock()
        expected_dict = {
            'id': 1
        }
        # Define response data for my Mock object
        mock_response.json.return_value = expected_dict
        mock_response.status_code = 200

        # Define response for the fake API
        mock_post.return_value = mock_response

        url = reverse('account:temporary-registration')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        payload = {
            'first_name': 'test_name',
            'last_name': 'test_last_name',
            'email': 'test@not-ec-nantes.fr',
            'confirm_email': 'test@not-ec-nantes.fr',
            'password1': 'pass',
            'password2': 'pass',
            'promo': 2020,
            'faculty': 'Gen',
            'path': 'Cla'
        }

        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, 302)
        user: User = User.objects.get(email='test@not-ec-nantes.fr')
        self.assertEqual(user.is_active, False)

        # Check that you cannot login yet
        url = reverse('account:login')
        payload = {
            'email': 'test@not-ec-nantes.fr',
            'password': 'pass'
        }
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, 302)
        self.assertFalse(get_user(self.client).is_authenticated)
        # Check that a temporary access request has been created
        temp_req: TemporaryAccessRequest = TemporaryAccessRequest.objects.get(
            user=user.id)
        self.assertFalse(temp_req.approved)

        assert len(mail.outbox) == 1
        extract = re.search(
            "<a href='http:\/\/testserver/account/activate/([^/]*)/([^/]*)", mail.outbox[0].body)
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
            'password': 'pass'
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
            username=user.username, password='pass'))
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
            'password': 'pass'
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
        extract = re.search(
            "<a href='http:\/\/testserver/account/activate/([^/]*)/([^/]*)", mail.outbox[2].body)
        uidb64 = extract.group(1)
        token = extract.group(2)
        url = reverse('account:confirm', kwargs={
                      'uidb64': uidb64, 'token': token})
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
        mock_response = mock.Mock()
        expected_dict = {
            'id': 1
        }
        # Define response data for my Mock object
        mock_response.json.return_value = expected_dict
        mock_response.status_code = 200

        # Define response for the fake API
        mock_post.return_value = mock_response

        url = reverse('account:temporary-registration')

        payload = {
            'first_name': 'test_name',
            'last_name': 'test_last_name',
            'email': 'test@ec-nantes.fr',
            'confirm_email': 'test@ec-nantes.fr',
            'password1': 'pass',
            'password2': 'pass',
            'promo': 2020,
            'faculty': 'Gen',
            'path': 'Cla'
        }

        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, 302)
        user: User = User.objects.get(email='test@ec-nantes.fr')
        self.assertEqual(user.is_active, False)

        temp_req: TemporaryAccessRequest = TemporaryAccessRequest.objects.get(
            user=user)
        resp = self.client.get(temp_req.deny_url)
        self.assertEqual(resp.status_code, 302)
        user = self.create_user('user1', 'test@test.fr')
        self.assertTrue(self.client.login(
            username=user.username, password='pass'))
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
