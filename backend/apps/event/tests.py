import calendar
from datetime import date, datetime, time, timedelta
from itertools import pairwise

from django.test import TestCase
from django.utils import timezone

from rest_framework import status
from rest_framework.test import APITestCase

from apps.account.models import User
from apps.group.models import Group, GroupType
from apps.utils.utest import TestMixin

from .models import MAX_SPORT_EVENT_OCCURRENCES, Event, SportEvent


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
        self.group = Group.objects.create(
            name="SportClub",
            group_type=self.group_type,
            can_create_sport_event=True,
        )
        self.group.members.add(self.admin, through_defaults={"admin": True})
        self.group.members.add(self.member)
        self.unauthorized_group = Group.objects.create(
            name="UnauthorizedClub",
            group_type=self.group_type,
            can_create_sport_event=False,
        )
        self.unauthorized_group.members.add(
            self.admin, through_defaults={"admin": True}
        )
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

    def test_create_rejects_admin_of_unauthorized_group(self):
        self.client.force_login(self.admin)
        response = self.client.post(
            "/api/event/sport/",
            {
                "owner": self.unauthorized_group.id,
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
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

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
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_partial_update_rejects_non_admin_without_owner_in_payload(self):
        # a PATCH omitting "owner" must still be blocked for a non-admin:
        # the admin check must not depend on "owner" being present in the
        # payload (only object-level permissions guarantee that).
        self.client.force_login(self.outsider)
        response = self.client.patch(
            f"/api/event/sport/{self.event.id}/",
            {"location": "Hacked"},
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.event.refresh_from_db()
        self.assertNotEqual(self.event.location, "Hacked")

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

        delete_response = self.client.delete(
            f"/api/event/sport/{sport_event_id}/"
        )
        self.assertEqual(
            delete_response.status_code, status.HTTP_204_NO_CONTENT
        )

    def test_member_can_join(self):
        self.client.force_login(self.member)
        self.event.non_participants.add(self.member)
        response = self.client.post(
            f"/api/event/sport/{self.event.id}/participate/"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            self.event.participants.filter(id=self.member.id).exists()
        )
        self.assertFalse(
            self.event.non_participants.filter(id=self.member.id).exists()
        )

    def test_outsider_cannot_join(self):
        self.client.force_login(self.outsider)
        response = self.client.post(
            f"/api/event/sport/{self.event.id}/participate/"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_member_can_switch_to_non_participant(self):
        self.client.force_login(self.member)
        self.event.participants.add(self.member)
        response = self.client.post(
            f"/api/event/sport/{self.event.id}/not_participate/"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(
            self.event.participants.filter(id=self.member.id).exists()
        )
        self.assertTrue(
            self.event.non_participants.filter(id=self.member.id).exists()
        )


class RecurrentSportEventAPITestCase(APITestCase):
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
        self.group_type = GroupType.objects.create(name="T1", slug="t1")
        self.group = Group.objects.create(
            name="SportClub",
            group_type=self.group_type,
            can_create_sport_event=True,
        )
        self.group.members.add(self.admin, through_defaults={"admin": True})
        self.group.members.add(self.member)
        # a Tuesday at 18:00 (local time), 2 weeks before the switch to
        # winter time (last Sunday of October)
        october_31 = date(timezone.now().year + 1, 10, 31)
        last_sunday = october_31 - timedelta(
            days=(october_31.weekday() - calendar.SUNDAY) % 7,
        )
        self.start = datetime.combine(
            last_sunday - timedelta(days=12),
            time(18),
            tzinfo=timezone.get_current_timezone(),
        )
        self.client.force_login(self.admin)

    def tearDown(self):
        SportEvent.objects.all().delete()
        Group.objects.all().delete()
        GroupType.objects.all().delete()
        User.objects.all().delete()

    def create_recurrent_event(self, weeks: int) -> list[SportEvent]:
        response = self.client.post(
            "/api/event/sport/",
            {
                "owner": self.group.id,
                "date": self.start,
                "repeat_until": self.start + timedelta(weeks=weeks - 1),
                "location": "Gym",
                "description_fr": "Entrainement",
                "description_en": "Training",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        events = [SportEvent.objects.get(id=response.data["id"])]
        while (child := events[-1].get_child()) is not None:
            events.append(child)
        return events

    def test_create_with_repeat_creates_weekly_chain(self):
        events = self.create_recurrent_event(weeks=4)
        self.assertEqual(len(events), 4)
        self.assertEqual(SportEvent.objects.count(), 4)
        self.assertIsNone(events[0].parent)
        for previous, event in pairwise(events):
            self.assertEqual(event.parent_id, previous.id)
            self.assertEqual(event.location, "Gym")
            self.assertEqual(event.description_fr, "Entrainement")
            self.assertEqual(event.description_en, "Training")
            self.assertEqual(event.owner_id, self.group.id)
        for i, event in enumerate(events):
            local_date = timezone.localtime(event.date)
            # same wall-clock time, even after the switch to winter time
            self.assertEqual(local_date.hour, 18)
            self.assertEqual(
                local_date.date(),
                timezone.localtime(self.start).date() + timedelta(weeks=i),
            )

    def test_create_with_repeat_includes_until_date(self):
        response = self.client.post(
            "/api/event/sport/",
            {
                "owner": self.group.id,
                "date": self.start,
                "repeat_until": self.start + timedelta(weeks=2, hours=-1),
                "location": "Gym",
                "description": "Training",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SportEvent.objects.count(), 2)

    def test_create_rejects_repeat_until_before_date(self):
        response = self.client.post(
            "/api/event/sport/",
            {
                "owner": self.group.id,
                "date": self.start,
                "repeat_until": self.start - timedelta(days=1),
                "location": "Gym",
                "description": "Training",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("repeat_until", response.data)
        self.assertEqual(SportEvent.objects.count(), 0)

    def test_create_rejects_too_many_occurrences(self):
        response = self.client.post(
            "/api/event/sport/",
            {
                "owner": self.group.id,
                "date": self.start,
                "repeat_until": self.start
                + timedelta(weeks=MAX_SPORT_EVENT_OCCURRENCES),
                "location": "Gym",
                "description": "Training",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("repeat_until", response.data)
        self.assertEqual(SportEvent.objects.count(), 0)

    def test_update_rejects_repeat_until(self):
        events = self.create_recurrent_event(weeks=1)
        response = self.client.patch(
            f"/api/event/sport/{events[0].id}/",
            {"repeat_until": self.start + timedelta(weeks=3)},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("repeat_until", response.data)
        self.assertEqual(SportEvent.objects.count(), 1)

    def test_update_propagates_to_descendants_only(self):
        events = self.create_recurrent_event(weeks=4)
        events[3].participants.add(self.member)
        response = self.client.patch(
            f"/api/event/sport/{events[1].id}/",
            {
                "location": "Stadium",
                "description_en": "Match",
                "type": 2,
                # one hour later
                "date": events[1].date + timedelta(hours=1),
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for event in events:
            event.refresh_from_db()

        self.assertEqual(events[0].location, "Gym")
        self.assertEqual(events[0].description_en, "Training")
        self.assertEqual(timezone.localtime(events[0].date).hour, 18)
        for event in events[1:]:
            self.assertEqual(event.location, "Stadium")
            self.assertEqual(event.description_en, "Match")
            self.assertEqual(event.description_fr, "Entrainement")
            self.assertEqual(event.type, 2)
            # the shift is applied in local time, across the DST switch
            self.assertEqual(timezone.localtime(event.date).hour, 19)
        # participants are specific to each occurrence
        self.assertTrue(events[3].participants.filter(id=self.member.id).exists())
        self.assertFalse(events[2].participants.exists())

    def test_delete_deletes_descendants_only(self):
        events = self.create_recurrent_event(weeks=4)
        response = self.client.delete(f"/api/event/sport/{events[2].id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(
            set(SportEvent.objects.values_list("id", flat=True)),
            {events[0].id, events[1].id},
        )
        events[1].refresh_from_db()
        self.assertIsNone(events[1].get_child())

    def test_delete_single_relinks_chain(self):
        events = self.create_recurrent_event(weeks=4)
        response = self.client.delete(
            f"/api/event/sport/{events[1].id}/?single=true",
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(SportEvent.objects.count(), 3)
        self.assertFalse(SportEvent.objects.filter(id=events[1].id).exists())
        events[2].refresh_from_db()
        self.assertEqual(events[2].parent_id, events[0].id)

    def test_delete_single_first_occurrence(self):
        events = self.create_recurrent_event(weeks=3)
        response = self.client.delete(
            f"/api/event/sport/{events[0].id}/?single=true",
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(SportEvent.objects.count(), 2)
        events[1].refresh_from_db()
        self.assertIsNone(events[1].parent)

    def test_retrieve_exposes_parent_and_child(self):
        events = self.create_recurrent_event(weeks=3)
        response = self.client.get(f"/api/event/sport/{events[1].id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["parent"], events[0].id)
        self.assertEqual(response.data["child"], events[2].id)

        response = self.client.get(
            "/api/event/sport/",
            {"from_date": self.start.isoformat()},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        last = next(e for e in response.data["results"] if e["id"] == events[2].id)
        self.assertEqual(last["parent"], events[1].id)
        self.assertIsNone(last["child"])
