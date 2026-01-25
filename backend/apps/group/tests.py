import logging

from rest_framework import status
from rest_framework.test import APITestCase

from apps.account.models import User
from apps.utils.testing.mocks import create_student_user

from .models import Group, GroupType, Membership


class TestGroups(APITestCase):
    def setUp(self):
        self.u1 = create_student_user(username="u1")
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
        g = Group.objects.create(french_name="G1", group_type=self.t1)
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
        g.members.add(self.u1.student)
        res = self.client.get("/api/group/group/", {"type": "t1"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data.get("results")), 1)

    def test_create(self):
        self.client.force_login(self.u1)
        init_nb = Group.objects.count()
        # test on a type that is forbidden
        res = self.client.post("/api/group/group/?type=t1", {"french_name": "G1"})
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Group.objects.count(), init_nb)
        # test on a type that is open
        res = self.client.post("/api/group/group/?type=t2", {"french_name": "G1"})
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Group.objects.count(), init_nb + 1)

    def test_retrieve(self):
        self.client.force_login(self.u1)
        g = Group.objects.create(french_name="G1", group_type=self.t1)
        # test to retrieve a normal group
        res = self.client.get(f"/api/group/group/{g.slug}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # test with private=True
        g.private = True
        g.save()
        res = self.client.get(f"/api/group/group/{g.slug}/")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        g.members.add(self.u1.student)
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
        g = Group.objects.create(french_name="G1", slug="g1", group_type=self.t1)
        # test for non-authenticated users
        res = self.client.put(f"/api/group/group/{g.slug}/", {"french_name": "G2"})
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        # test with authenticated user
        self.client.force_login(self.u1)
        res = self.client.put(f"/api/group/group/{g.slug}/", {"french_name": "G2"})
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        # test with member
        g.members.add(self.u1.student)
        res = self.client.put(f"/api/group/group/{g.slug}/", {"french_name": "G2"})
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        # test with admin
        g.membership_set.filter(student=self.u1.student).update(admin=True)
        res = self.client.put(f"/api/group/group/{g.slug}/", {"french_name": "G2"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # check the modification is done
        self.assertEqual(Group.objects.get(slug="g1").name, "G2")

    def test_delete(self):
        g = Group.objects.create(french_name="G1", slug="g1", group_type=self.t1)
        # test for non-authenticated users
        res = self.client.delete(f"/api/group/group/{g.slug}/")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        # test with authenticated user
        self.client.force_login(self.u1)
        res = self.client.delete(f"/api/group/group/{g.slug}/")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        # test with member
        g.members.add(self.u1.student)
        res = self.client.delete(f"/api/group/group/{g.slug}/")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        # test with admin
        g.membership_set.filter(student=self.u1.student).update(admin=True)
        res = self.client.delete(f"/api/group/group/{g.slug}/")
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        # check the modification is done
        self.assertFalse(Group.objects.filter(slug="g1").exists())


class TestMemberships(APITestCase):
    def setUp(self):
        self.u1 = create_student_user(username="u1", email="u1@ec-nantes.fr")
        self.u2 = create_student_user(username="u2", email="u2@ec-nantes.fr")
        self.u3 = create_student_user(username="u3", email="u3@ec-nantes.fr")
        self.t1 = GroupType.objects.create(name="T1", slug="t1")
        self.g1 = Group.objects.create(french_name="G1", group_type=self.t1)
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
        self.g1.members.add(self.u2.student)
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
        self.g1.members.add(self.u1.student)
        res = self.client.get("/api/group/membership/", {"group": "g1"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data.get("results")), 2)
        self.g1.private = False
        self.g1.save()
        # test on student
        res = self.client.get("/api/group/membership/", {"student": self.u2.id})
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
            {"group": self.g1.id, "student": self.u1.id},
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        # test with dates
        res = self.client.post(
            "/api/group/membership/",
            {
                "group": self.g1.id,
                "student": self.u1.id,
                "begin_date": "2022-01-01",
                "end_date": "2023-01-01",
            },
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.g1.members.count(), init_nb + 1)
        # test for groups with no_memberships_dates
        self.g1.membership_set.filter(student=self.u1.student).delete()
        self.t1.no_membership_dates = True
        self.t1.save()
        res = self.client.post(
            "/api/group/membership/",
            {"group": self.g1.id, "student": self.u1.id},
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.g1.members.count(), init_nb + 1)
        # test for creating the a duplicate membership
        res = self.client.post(
            "/api/group/membership/",
            {"group": self.g1.id, "student": self.u1.id},
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.g1.members.count(), init_nb + 1)
        # test for adding another member
        res = self.client.post(
            "/api/group/membership/",
            {"group": self.g1.id, "student": self.u2.id},
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.g1.members.count(), init_nb + 1)
        # test for adding a new member if admin
        self.g1.membership_set.filter(student=self.u1.student).update(
            admin=True,
        )
        res = self.client.post(
            "/api/group/membership/",
            {"group": self.g1.id, "student": self.u2.id},
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.g1.members.count(), init_nb + 2)
        # test of locking
        self.g1.lock_memberships = True
        self.g1.save()
        self.client.force_login(self.u3)
        res = self.client.post(
            "/api/group/membership/",
            {"group": self.g1.id, "student": self.u3.id},
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve(self):
        m2 = Membership.objects.create(student=self.u2.student, group=self.g1)
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
        m1 = Membership.objects.create(student=self.u1.student, group=self.g1)
        m2 = Membership.objects.create(student=self.u2.student, group=self.g1)
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
            self.g1.membership_set.get(student=self.u1.student).summary,
            "Test",
        )
        self.assertEqual(
            self.g1.membership_set.get(student=self.u2.student).summary,
            "Test2",
        )

    def test_delete(self):
        m1 = Membership.objects.create(student=self.u1.student, group=self.g1)
        m2 = Membership.objects.create(student=self.u2.student, group=self.g1)
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
            student=self.u1.student,
            admin=True,
        )
        m2 = Membership.objects.create(group=self.g1, student=self.u2.student)
        # test to order u1 before u2
        res = self.client.post(
            f"/api/group/membership/reorder/?group={self.g1.slug}",
            {"member": m1.id, "lower": m2.id},
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        ms = self.g1.membership_set.all().order_by("-priority")
        self.assertEqual(ms[0].student, self.u1.student)
        self.assertEqual(ms[1].student, self.u2.student)
        # test to order u2 before u1
        res = self.client.post(
            f"/api/group/membership/reorder/?group={self.g1.slug}",
            {"member": m1.id},
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        ms = self.g1.membership_set.all().order_by("-priority")
        self.assertEqual(ms[0].student, self.u2.student)
        self.assertEqual(ms[1].student, self.u1.student)


class SubscriptionTest(APITestCase):
    def setUp(self):
        self.u1 = create_student_user(username="u1", email="u1@ec-nantes.fr")
        self.t1 = GroupType.objects.create(name="T1", slug="t1")
        self.g1 = Group.objects.create(french_name="G1", group_type=self.t1)
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
        self.assertTrue(self.g1.subscribers.contains(self.u1.student))
        # add again
        res = self.client.post(self.url, {"subscribe": True})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(self.g1.subscribers.contains(self.u1.student))
        # remove subscription
        res = self.client.post(self.url, {"subscribe": False})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertFalse(self.g1.subscribers.contains(self.u1.student))
