from django.test import TestCase
from django.utils import timezone

from rest_framework import status
from rest_framework.test import APITestCase

from apps.account.models import User
from apps.group.models import Group, GroupType
from apps.utils.utest import TestMixin

from .models import Event, SportEvent


class EventTestCase(TestCase, TestMixin):
    def setUp(self) -> None:
        self.user_setup()
        t = GroupType.objects.create(name="T1", slug="t1")
        self.g = Group.objects.create(name="TestClubForEvents", group_type=t)
        self.g.members.add(self.u2, through_defaults={"admin": True})
        self.event = Event.objects.create(
            title="A test event 1",
            group=self.g,
            start_date=timezone.now(),
            description="Test Desc",
            location="Amphi A",
        )

    def tearDown(self):
        self.user_teardown()
        GroupType.objects.filter(slug="t1").delete()
        Event.objects.all().delete()


class SportEventAPITestCase(APITestCase):
    def setUp(self) -> None:
        self.admin = User.objects.create_user(
            username="admin",
            email="admin@test.ec-nantes.fr",
            password="",
        )
        self.member = User.objects.create_user(
            username="member",
            email="member@test.ec-nantes.fr",
            password="",
        )
        self.outsider = User.objects.create_user(
            username="outsider",
            email="outsider@test.ec-nantes.fr",
            password="",
        )
        self.group_type = GroupType.objects.create(name="T1", slug="t1")
        self.group = Group.objects.create(name="SportClub", group_type=self.group_type)
        self.group.members.add(self.admin, through_defaults={"admin": True})
        self.group.members.add(self.member)
        self.event = SportEvent.objects.create(
            owner=self.group,
            date=timezone.now() + timezone.timedelta(days=1),
            location="Gym",
            description="Training",
        )

    def tearDown(self):
        SportEvent.objects.all().delete()
        Group.objects.all().delete()
        GroupType.objects.all().delete()
        User.objects.all().delete()

    def test_create_rejects_past_date(self):
        self.client.force_login(self.admin)
        response = self.client.post(
            "/api/event/sport/",
            {
                "owner": self.group.id,
                "date": timezone.now() - timezone.timedelta(days=1),
                "location": "Gym",
                "description": "Training",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("date", response.data)

    def test_create_rejects_non_admin(self):
        self.client.force_login(self.member)
        response = self.client.post(
            "/api/event/sport/",
            {
                "owner": self.group.id,
                "date": timezone.now() + timezone.timedelta(days=1),
                "location": "Gym",
                "description": "Training",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("owner", response.data)

    def test_create_rejects_non_member(self):
        self.client.force_login(self.outsider)
        response = self.client.post(
            "/api/event/sport/",
            {
                "owner": self.group.id,
                "date": timezone.now() + timezone.timedelta(days=1),
                "location": "Gym",
                "description": "Training",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("owner", response.data)

    def test_create_rejects_overlap_between_participant_lists(self):
        self.client.force_login(self.admin)
        response = self.client.post(
            "/api/event/sport/",
            {
                "owner": self.group.id,
                "date": timezone.now() + timezone.timedelta(days=1),
                "location": "Gym",
                "description": "Training",
                "participants": [self.member.id],
                "non_participants": [self.member.id],
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("participants", response.data)
        self.assertIn("non_participants", response.data)

    def test_update_rejects_non_admin(self):
        self.client.force_login(self.member)
        response = self.client.put(
            f"/api/event/sport/{self.event.id}/",
            {
                "owner": self.group.id,
                "date": timezone.now() + timezone.timedelta(days=2),
                "location": "Gym 2",
                "description": "Updated",
                "type": self.event.type,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("owner", response.data)

    def test_update_rejects_overlap_between_participant_lists(self):
        self.client.force_login(self.admin)
        response = self.client.put(
            f"/api/event/sport/{self.event.id}/",
            {
                "owner": self.group.id,
                "date": timezone.now() + timezone.timedelta(days=2),
                "location": "Gym 2",
                "description": "Updated",
                "type": self.event.type,
                "participants": [self.member.id],
                "non_participants": [self.member.id],
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("participants", response.data)
        self.assertIn("non_participants", response.data)

    def test_update_requires_admin_even_without_owner_in_payload(self):
        self.client.force_login(self.outsider)
        response = self.client.put(
            f"/api/event/sport/{self.event.id}/",
            {
                "date": timezone.now() + timezone.timedelta(days=2),
                "location": "Gym 2",
                "description": "Updated",
                "type": self.event.type,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("owner", response.data)

    def test_delete_requires_admin(self):
        self.client.force_login(self.member)
        response = self.client.delete(f"/api/event/sport/{self.event.id}/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_update_and_delete(self):
        self.client.force_login(self.admin)
        create_response = self.client.post(
            "/api/event/sport/",
            {
                "owner": self.group.id,
                "date": timezone.now() + timezone.timedelta(days=3),
                "location": "Gym",
                "description": "Training",
            },
        )
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        sport_event_id = create_response.data["id"]

        update_response = self.client.put(
            f"/api/event/sport/{sport_event_id}/",
            {
                "owner": self.group.id,
                "date": timezone.now() + timezone.timedelta(days=4),
                "location": "Gym 2",
                "description": "Updated",
                "type": create_response.data["type"],
            },
        )
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)

        delete_response = self.client.delete(f"/api/event/sport/{sport_event_id}/")
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)

    def test_member_can_join(self):
        self.client.force_login(self.member)
        self.event.non_participants.add(self.member)
        response = self.client.post(f"/api/event/sport/{self.event.id}/participate/")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(self.event.participants.filter(id=self.member.id).exists())
        self.assertFalse(self.event.non_participants.filter(id=self.member.id).exists())

    def test_outsider_cannot_join(self):
        self.client.force_login(self.outsider)
        response = self.client.post(f"/api/event/sport/{self.event.id}/participate/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_member_can_switch_to_non_participant(self):
        self.client.force_login(self.member)
        self.event.participants.add(self.member)
        response = self.client.post(
            f"/api/event/sport/{self.event.id}/not_participate/"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(self.event.participants.filter(id=self.member.id).exists())
        self.assertTrue(
            self.event.non_participants.filter(id=self.member.id).exists()
        )
