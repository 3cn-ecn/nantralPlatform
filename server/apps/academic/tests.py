from django.test import TestCase
from django.shortcuts import reverse
from apps.utils.utest import TestMixin

from .models import Course, FollowCourse

class TestCourses(TestCase, TestMixin):
    def setUp(self):
        self.user_setup()
    
    def test_create_course(self):
        Course.objects.create(name='testCourse', type='Option Disciplinaire')

        self.assertEqual(len(Course.objects.all()), 1)

        course = Course.objects.all().first()
        url = reverse('academic:course', args=[course.pk])
        result = self.client.get(url)

        self.assertEqual(result.status_code, 200)

    def test_follow_course(self):
        pass