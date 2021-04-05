from datetime import datetime
from django.utils.timezone import make_aware
from django.test import TestCase
from django.urls import reverse
from rest_framework import status

from apps.utils.utest import TestMixin
from apps.group.models import Club

from .models import Post


class PostTestCase(TestCase, TestMixin):
    def setUp(self) -> None:
        self.user_setup()
        self.club = Club.objects.create(
            name="TestClubForPosts")
        self.club.admins.set([self.u2.student])
        self.post = Post.objects.create(
            title="TestPost", group=self.club.slug, publication_date=make_aware(datetime.now()),
            description="Test Desc")
        self.assertEqual(len(Post.objects.all()), 1)

    def test_post_detail_view(self):
        url = reverse('post:detail', args=[self.post.slug])
        # Une personne non connectée ne doit pas pouvoir voir le post et doit être redirigée vers la page de login
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_302_FOUND)

        self.client.login(username=self.u1, password="pass")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_post_update_view(self):
        url = reverse("post:edit", args=[self.post.slug])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_302_FOUND)

        self.client.login(username=self.u2, password="pass")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_post_group_list_view(self):
        """Test that the group list/update view for posts works with only authorized access."""
        url = reverse("group:update-posts", args=[self.club.slug])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_302_FOUND)
        self.client.login(username=self.u3, password="pass")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)
        self.client.login(username=self.u2, password="pass")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_create_post_group_view(self):
        """Test that the group create post view works for authorized access,"""
        url = reverse("group:create-post", args=[self.club.slug])
        self.client.login(username=self.u2, password="pass")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        data = {
            "title": "TestPost2",
            "publication_date": str(datetime.now()),
            "description": "Test",
            "color": "primary",
            "publicity": "Pub"
        }
        resp = self.client.post(url, data)
        self.assertEqual(resp.status_code, status.HTTP_302_FOUND)
        self.assertEqual(len(Post.objects.all()), 2)


class APIPostTestCase(TestCase, TestMixin):
    def setUp(self) -> None:
        self.user_setup()
        self.club = Club.objects.create(
            name="TestClubForPosts")
        self.club.admins.set([self.u2.student])
        self.post = Post.objects.create(
            title="TestPost", group=self.club.slug, publication_date=make_aware(datetime.now()),
            description="Test Desc")
        self.assertEqual(len(Post.objects.all()), 1)
