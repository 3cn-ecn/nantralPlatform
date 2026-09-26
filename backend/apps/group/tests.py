import logging

from rest_framework import status
from rest_framework.test import APITestCase

from apps.account.models import User

from .models import Group, GroupType, Membership


class TestGroups(APITestCase):
    def setUp(self):
        self.u1 = User.objects.create_user(
            username="u1", email="u1@test.ec-nantes.fr", password=""
        )
        self.t1 = GroupType.objects.create(name="T1", slug="t1")
        self.t2 = GroupType.objects.create(
            name="T2",
            slug="t2",
            can_create=True,
        )
        # deactivate warnings
        logger = logging.getLogger("django.request")
        self.previous_level = logger.getEffectiveLevel()
        logger.setLevel(logging.ERROR)

    def tearDown(self):
        User.objects.all().delete()
        GroupType.objects.filter(slug="t1").delete()
        GroupType.objects.filter(slug="t2").delete()
        # re-activate warnings
        logger = logging.getLogger("django.request")
        logger.setLevel(self.previous_level)

    def test_list(self):
        self.client.force_login(self.u1)
        # test an empty list
        res = self.client.get("/api/group/group/", {"type": "t1"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data.get("results")), 0)
        # test with a group
        g = Group.objects.create(name="G1", group_type=self.t1)
        res = self.client.get("/api/group/group/", {"type": "t1"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data.get("results")), 1)
        # test with a private group
        g.private = True
        g.save()
        res = self.client.get("/api/group/group/", {"type": "t1"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data.get("results")), 0)
        # test with a private group where the user is member
        g.members.add(self.u1)
        res = self.client.get("/api/group/group/", {"type": "t1"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data.get("results")), 1)

    def test_create(self):
        self.client.force_login(self.u1)
        init_nb = Group.objects.count()
        # test on a type that is forbidden
        res = self.client.post("/api/group/group/?type=t1", {"name": "G1"})
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Group.objects.count(), init_nb)
        # test on a type that is open
        res = self.client.post(
            "/api/group/group/?type=t2",
            {"name": "G1", "_save_history_record": False},
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Group.objects.count(), init_nb + 1)

    def test_retrieve(self):
        self.client.force_login(self.u1)
        g = Group.objects.create(name="G1", group_type=self.t1)
        # test to retrieve a normal group
        res = self.client.get(f"/api/group/group/{g.slug}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # test with private=True
        g.private = True
        g.save()
        res = self.client.get(f"/api/group/group/{g.slug}/")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        g.members.add(self.u1)
        res = self.client.get(f"/api/group/group/{g.slug}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        g.private = False
        g.save()
        # test with public=True
        self.client.logout()
        res = self.client.get(f"/api/group/group/{g.slug}/")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        g.public = True
        g.save()
        res = self.client.get(f"/api/group/group/{g.slug}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_update(self):
        g = Group.objects.create(name="G1", slug="g1", group_type=self.t1)
        # test for non-authenticated users
        res = self.client.put(
            f"/api/group/group/{g.slug}/",
            {"name": "G2", "_save_history_record": False},
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        # test with authenticated user
        self.client.force_login(self.u1)
        res = self.client.put(
            f"/api/group/group/{g.slug}/",
            {"name": "G2", "_save_history_record": False},
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        # test with member
        g.members.add(self.u1)
        res = self.client.put(
            f"/api/group/group/{g.slug}/",
            {"name": "G2", "_save_history_record": False},
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        # test with admin
        g.membership_set.filter(user=self.u1).update(admin=True)
        res = self.client.put(
            f"/api/group/group/{g.slug}/",
            {"name": "G2", "_save_history_record": False},
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # check the modification is done
        self.assertEqual(Group.objects.get(slug="g1").name, "G2")

    def test_delete(self):
        g = Group.objects.create(name="G1", slug="g1", group_type=self.t1)
        # test for non-authenticated users
        res = self.client.delete(f"/api/group/group/{g.slug}/")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        # test with authenticated user
        self.client.force_login(self.u1)
        res = self.client.delete(f"/api/group/group/{g.slug}/")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        # test with member
        g.members.add(self.u1)
        res = self.client.delete(f"/api/group/group/{g.slug}/")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        # test with admin
        g.membership_set.filter(user=self.u1).update(admin=True)
        res = self.client.delete(f"/api/group/group/{g.slug}/")
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        # check the modification is done
        self.assertFalse(Group.objects.filter(slug="g1").exists())


class TestSportEventManageableGroups(APITestCase):
    def setUp(self):
        self.superuser = User.objects.create_superuser(
            username="superuser", email="su@test.ec-nantes.fr", password=""
        )
        self.parent_admin = User.objects.create_user(
            username="parent_admin", email="pa@test.ec-nantes.fr", password=""
        )
        self.child_admin = User.objects.create_user(
            username="child_admin", email="ca@test.ec-nantes.fr", password=""
        )
        self.member = User.objects.create_user(
            username="member", email="m@test.ec-nantes.fr", password=""
        )
        self.t1 = GroupType.objects.create(name="T1", slug="t1")
        self.parent = Group.objects.create(
            name="BDS", group_type=self.t1, can_create_sport_event=True
        )
        self.child = Group.objects.create(
            name="Club", group_type=self.t1, parent=self.parent, private=True
        )
        self.grandchild = Group.objects.create(
            name="SubClub", group_type=self.t1, parent=self.child
        )
        self.forbidden_child = Group.objects.create(
            name="NoSportClub",
            group_type=self.t1,
            parent=self.parent,
            can_create_sport_event=False,
        )
        self.unauthorized = Group.objects.create(name="Other", group_type=self.t1)
        self.archived = Group.objects.create(
            name="Archived",
            group_type=self.t1,
            parent=self.parent,
            archived=True,
        )
        self.parent.members.add(
            self.parent_admin, through_defaults={"admin": True}
        )
        self.child.members.add(self.child_admin, through_defaults={"admin": True})
        self.parent.members.add(self.member)

    def tearDown(self):
        Group.objects.all().delete()
        GroupType.objects.all().delete()
        User.objects.all().delete()

    def get_slugs(self, user: User) -> set[str]:
        self.client.force_login(user)
        res = self.client.get(
            "/api/group/group/", {"can_manage_sport_events": True}
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        return {g["slug"] for g in res.data["results"]}

    def test_superuser_gets_all_authorized_groups(self):
        self.assertEqual(
            self.get_slugs(self.superuser),
            {self.parent.slug, self.child.slug, self.grandchild.slug},
        )

    def test_parent_admin_gets_descendants(self):
        self.assertEqual(
            self.get_slugs(self.parent_admin),
            {self.parent.slug, self.child.slug, self.grandchild.slug},
        )

    def test_child_admin_gets_only_its_subtree(self):
        self.assertEqual(
            self.get_slugs(self.child_admin),
            {self.child.slug, self.grandchild.slug},
        )

    def test_member_gets_nothing(self):
        self.assertEqual(self.get_slugs(self.member), set())

    def test_matches_is_admin_and_check_can_create_sport_event(self):
        for user in (
            self.superuser,
            self.parent_admin,
            self.child_admin,
            self.member,
        ):
            expected = {
                g.id
                for g in Group.objects.all()
                if g.check_can_create_sport_event and g.is_admin(user)
            }
            self.assertEqual(
                set(
                    Group.sport_event_manageable_by(user).values_list(
                        "id", flat=True
                    )
                ),
                expected,
            )


class TestMemberships(APITestCase):
    def setUp(self):
        self.u1 = User.objects.create_user(
            username="u1", email="u1@ec-nantes.fr", password=""
        )
        self.u2 = User.objects.create_user(
            username="u2", email="u2@ec-nantes.fr", password=""
        )
        self.u3 = User.objects.create_user(
            username="u3", email="u3@ec-nantes.fr", password=""
        )
        self.t1 = GroupType.objects.create(name="T1", slug="t1")
        self.g1 = Group.objects.create(name="G1", group_type=self.t1)
        # deactivate warnings
        logger = logging.getLogger("django.request")
        self.previous_level = logger.getEffectiveLevel()
        logger.setLevel(logging.ERROR)

    def tearDown(self):
        User.objects.all().delete()
        GroupType.objects.filter(slug="t1").delete()
        # re-activate warnings
        logger = logging.getLogger("django.request")
        logger.setLevel(self.previous_level)

    def test_list(self):
        self.client.force_login(self.u1)
        # test an empty list
        res = self.client.get("/api/group/membership/", {"group": "g1"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data.get("results")), 0)
        # test with one membership
        self.g1.members.add(self.u2)
        res = self.client.get("/api/group/membership/", {"group": "g1"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data.get("results")), 1)
        # test with a private group
        self.g1.private = True
        self.g1.save()
        res = self.client.get("/api/group/membership/", {"group": "g1"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data.get("results")), 0)
        # test with a private group where the user is member
        self.g1.members.add(self.u1)
        res = self.client.get("/api/group/membership/", {"group": "g1"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data.get("results")), 2)
        self.g1.private = False
        self.g1.save()
        # test on user
        res = self.client.get("/api/group/membership/", {"user": self.u2.id})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data.get("results")), 1)
        # test if non authenticated
        self.client.logout()
        res = self.client.get("/api/group/membership/", {"group": "g1"})
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_create(self):
        self.client.force_login(self.u1)
        init_nb = self.g1.members.count()
        # test without dates
        res = self.client.post(
            "/api/group/membership/",
            {"group": self.g1.id, "user": self.u1.id},
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        # test with dates
        res = self.client.post(
            "/api/group/membership/",
            {
                "group": self.g1.id,
                "user": self.u1.id,
                "begin_date": "2022-01-01",
                "end_date": "2023-01-01",
            },
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.g1.members.count(), init_nb + 1)
        # test for groups with no_memberships_dates
        self.g1.membership_set.filter(user=self.u1).delete()
        self.t1.no_membership_dates = True
        self.t1.save()
        res = self.client.post(
            "/api/group/membership/",
            {"group": self.g1.id, "user": self.u1.id},
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.g1.members.count(), init_nb + 1)
        # test for creating the a duplicate membership
        res = self.client.post(
            "/api/group/membership/",
            {"group": self.g1.id, "user": self.u1.id},
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.g1.members.count(), init_nb + 1)
        # test for adding another member
        res = self.client.post(
            "/api/group/membership/",
            {"group": self.g1.id, "user": self.u2.id},
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.g1.members.count(), init_nb + 1)
        # test for adding a new member if admin
        self.g1.membership_set.filter(user=self.u1).update(
            admin=True,
        )
        res = self.client.post(
            "/api/group/membership/",
            {"group": self.g1.id, "user": self.u2.id},
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.g1.members.count(), init_nb + 2)
        # test of locking
        self.g1.lock_memberships = True
        self.g1.save()
        self.client.force_login(self.u3)
        res = self.client.post(
            "/api/group/membership/",
            {"group": self.g1.id, "user": self.u3.id},
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve(self):
        m2 = Membership.objects.create(user=self.u2, group=self.g1)
        # test to retrieve
        self.client.force_login(self.u1)
        res = self.client.get(f"/api/group/membership/{m2.id}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.client.logout()
        res = self.client.get(f"/api/group/membership/{m2.id}/")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        # test with private=True
        self.g1.private = True
        self.g1.save()
        self.client.force_login(self.u3)
        res = self.client.get(f"/api/group/membership/{m2.id}/")
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)
        self.g1.private = False
        self.g1.save()
        # test with public=True
        self.client.logout()
        res = self.client.get(f"/api/group/membership/{m2.id}/")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_update(self):
        m1 = Membership.objects.create(user=self.u1, group=self.g1)
        m2 = Membership.objects.create(user=self.u2, group=self.g1)
        # test for non-authenticated users
        res = self.client.put(
            f"/api/group/membership/{m1.id}/",
            {"summary": "Test"},
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        # test with authenticated user
        self.client.force_login(self.u1)
        res = self.client.put(
            f"/api/group/membership/{m1.id}/",
            {"summary": "Test"},
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # test with other member
        res = self.client.put(
            f"/api/group/membership/{m2.id}/",
            {"summary": "Test2"},
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        # test with admin
        Membership.objects.filter(id=m1.id).update(admin=True)
        res = self.client.put(
            f"/api/group/membership/{m2.id}/",
            {"summary": "Test2"},
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # check the modifications are done
        self.assertEqual(
            self.g1.membership_set.get(user=self.u1).summary,
            "Test",
        )
        self.assertEqual(
            self.g1.membership_set.get(user=self.u2).summary,
            "Test2",
        )

    def test_delete(self):
        m1 = Membership.objects.create(user=self.u1, group=self.g1)
        m2 = Membership.objects.create(user=self.u2, group=self.g1)
        # test for non-authenticated users
        res = self.client.delete(f"/api/group/membership/{m2.id}/")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        # test with authenticated user
        self.client.force_login(self.u1)
        res = self.client.delete(f"/api/group/membership/{m2.id}/")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        # test with admin
        Membership.objects.filter(id=m1.id).update(admin=True)
        res = self.client.delete(f"/api/group/membership/{m2.id}/")
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        # test for yourself
        Membership.objects.filter(id=m1.id).update(admin=False)
        res = self.client.delete(f"/api/group/membership/{m1.id}/")
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        # check the modification is done
        self.assertFalse(Membership.objects.filter(id=m1.id).exists())
        self.assertFalse(Membership.objects.filter(id=m2.id).exists())

    def test_reorder(self):
        self.client.force_login(self.u1)
        m1 = Membership.objects.create(
            group=self.g1,
            user=self.u1,
            admin=True,
        )
        m2 = Membership.objects.create(group=self.g1, user=self.u2)
        # test to order u1 before u2
        res = self.client.post(
            f"/api/group/membership/reorder/?group={self.g1.slug}",
            {"member": m1.id, "lower": m2.id},
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        ms = self.g1.membership_set.all().order_by("-priority")
        self.assertEqual(ms[0].user, self.u1)
        self.assertEqual(ms[1].user, self.u2)
        # test to order u2 before u1
        res = self.client.post(
            f"/api/group/membership/reorder/?group={self.g1.slug}",
            {"member": m1.id},
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        ms = self.g1.membership_set.all().order_by("-priority")
        self.assertEqual(ms[0].user, self.u2)
        self.assertEqual(ms[1].user, self.u1)


class SubscriptionTest(APITestCase):
    def setUp(self):
        self.u1 = User.objects.create_user(
            username="u1", email="u1@ec-nantes.fr", password=""
        )
        self.t1 = GroupType.objects.create(name="T1", slug="t1")
        self.g1 = Group.objects.create(name="G1", group_type=self.t1)
        self.url = f"/api/group/group/{self.g1.slug}/update_subscription/"
        # deactivate warnings
        logger = logging.getLogger("django.request")
        self.previous_level = logger.getEffectiveLevel()
        logger.setLevel(logging.ERROR)

    def test_subscribe(self):
        res = self.client.post(self.url, {"subscribe": True})
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.client.force_login(self.u1)
        # add subscription
        res = self.client.post(self.url, {"subscribe": True})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(self.g1.subscribers.contains(self.u1))
        # add again
        res = self.client.post(self.url, {"subscribe": True})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(self.g1.subscribers.contains(self.u1))
        # remove subscription
        res = self.client.post(self.url, {"subscribe": False})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertFalse(self.g1.subscribers.contains(self.u1))
