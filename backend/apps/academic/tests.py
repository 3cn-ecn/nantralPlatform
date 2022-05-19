from django.test import TestCase
from django.shortcuts import reverse
from apps.utils.utest import TestMixin

from .models import Course

class TestCourses(TestCase, TestMixin):
    def setUp(self):
        self.user_setup()
    
    def tearDown(self):
        self.user_teardown()
    
    def test_create_course(self):
        Course.objects.create(name='testCourse', type='OD')

        self.assertEqual(len(Course.objects.all()), 1)

        course = Course.objects.all().first()
        url = reverse('academic:detail', args=[course.slug])
        result = self.client.get(url)

        self.assertEqual(result.status_code, 302)

    def test_follow_course(self):
        pass