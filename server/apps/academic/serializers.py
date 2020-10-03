from rest_framework import serializers

from .models import Course, FollowCourse

class  CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'


class FollowCourseSerializer(serializers.ModelSerializer):
    course = CourseSerializer()
    class Meta:
        model = FollowCourse
        fields = '__all__'