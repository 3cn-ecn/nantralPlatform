from rest_framework import serializers

from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    absolute_url = serializers.ReadOnlyField()

    class Meta:
        model = Student
        fields = '__all__'

    def get_name(self, obj) -> str:
        return obj.name


class SimpleStudentSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    picture_url = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ['id', 'full_name', 'url', 'picture_url']

    def get_full_name(self, obj: Student) -> str:
        return obj.user.get_full_name()

    def get_url(self, obj: Student) -> str:
        return obj.get_absolute_url()

    def get_picture_url(self, obj: Student) -> str | None:
        if obj.picture:
            return obj.picture.url
        else:
            return None
