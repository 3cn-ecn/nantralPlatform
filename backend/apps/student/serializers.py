from rest_framework import serializers

from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    staff = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ['id', 'name', 'promo', 'picture',
                  'faculty', 'path', 'url', 'staff']

    def get_name(self, obj: Student) -> str:
        return obj.name

    def get_url(self, obj: Student) -> str:
        return obj.get_absolute_url()

    def get_staff(self, obj: Student) -> bool:
        return obj.staff


class SimpleStudentSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ['id', 'full_name', 'url', 'picture']
        read_only = ['picture']

    def get_full_name(self, obj: Student) -> str:
        return obj.name

    def get_url(self, obj: Student) -> str:
        return obj.get_absolute_url()
