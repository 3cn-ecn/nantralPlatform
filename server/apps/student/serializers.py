from django.db.models import fields
from rest_framework import serializers

from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = '__all__'

    def get_name(self, obj) -> str:
        return obj.name
