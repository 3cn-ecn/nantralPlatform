from rest_framework import serializers

from .models import Course, NamedMembershipCourse

class  CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'


class NamedMembershipCourseSerializer(serializers.ModelSerializer):
    course = CourseSerializer()
    class Meta:
        model = NamedMembershipCourse
        fields = '__all__'